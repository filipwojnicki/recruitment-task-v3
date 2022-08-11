import { Logger, Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import type { Low, JSONFile } from 'lowdb';
import type { RedisClientType } from 'redis';
import { Client, Repository } from 'redis-om';

import { dynamicImport } from '../../common/utils';
import { DatabaseChangedEvent } from '../events/database-changed.event';

import { MovieData } from '../types/movie-data.type';
import type { Movie } from '../types/movie.type';
import { MovieSchema, MovieEntity } from '../entities/movie.entity';

import { GenreSchema, GenreEntity } from '../entities/genre.entity';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly redisClient: Client = new Client();
  private db: Low<MovieData>;
  private queue;

  private movieRepository: Repository<MovieEntity>;
  private genreRepository: Repository<GenreEntity>;

  @Inject('REDIS_CLIENT') private readonly redis: RedisClientType;

  constructor(private eventEmitter: EventEmitter2) {}

  async onModuleInit(): Promise<void> {
    const PQueue = await dynamicImport('p-queue');
    this.queue = new PQueue.default({
      concurrency: parseInt(process.env.DATA_QUEUE_CONCURRENCY, 10),
      timeout: 60 * 1000,
    });

    await this.redisClient.use(this.redis);
    await this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    try {
      this.logger.log('Database init');

      const lowdb = await dynamicImport('lowdb');

      const JSONFile: JSONFile<MovieData> = new lowdb.JSONFile(
        process.env.DATABASE_FILE_LOCATION,
      );

      this.db = new lowdb.Low(JSONFile);
      await this.readData();
      await this.synchronizeWithRedis();

      this.logger.log('Database init end');
    } catch (error) {
      this.logger.error(error?.message ? error.message : JSON.stringify(error));
      throw new Error("Database can't be loaded");
    }
  }

  async readData(): Promise<void> {
    try {
      await this.db.read();
    } catch (error) {
      this.logger.error(error?.message ? error.message : JSON.stringify(error));
      throw new Error("Database can't be read");
    }
  }

  async readDataFromDatastore() {
    const movieRepository = this.redisClient.fetchRepository(MovieSchema);
  }

  async writeData(): Promise<void> {
    try {
      await this.db.write();
      this.clearData();
    } catch (error) {
      this.logger.error(error?.message ? error.message : JSON.stringify(error));
      throw new Error("Database can't be write");
    }
  }

  clearData(): void {
    this.db.data = { genres: [], movies: [] };
  }

  databaseEmitChangeEvent(): boolean {
    const databaseChangedEvent = new DatabaseChangedEvent();
    databaseChangedEvent.name = 'write-file';
    return this.eventEmitter.emit('database.changed', databaseChangedEvent);
  }

  async addMovie(data: Movie): Promise<void> {
    const movie = this.movieRepository.createEntity();

    movie.id = Number(data.id);
    movie.title = data.title;
    movie.year = Number(data.year);
    movie.runtime = Number(data.runtime);
    movie.director = data.director;
    movie.actors = data.actors;
    movie.plot = data.plot;
    movie.posterUrl = data.posterUrl;
    movie.genres = data.genres;

    await this.movieRepository.save(movie);
  }

  async addGenre(name: string): Promise<void> {
    const genre = this.genreRepository.createEntity();

    genre.name = name;
    await this.genreRepository.save(genre);
  }

  async synchronizeWithRedis() {
    const lastImportedTimestamp = await this.redisClient.get(
      'database-imported-time',
    );

    this.movieRepository = this.redisClient.fetchRepository(MovieSchema);
    await this.movieRepository.createIndex();

    this.genreRepository = this.redisClient.fetchRepository(GenreSchema);
    await this.genreRepository.createIndex();

    if (lastImportedTimestamp) {
      const diffMsBetweenNowAndImport = Math.abs(
        Date.now() - parseInt(lastImportedTimestamp, 10),
      );

      this.logger.log(
        `Data imported ${new Date(
          parseInt(lastImportedTimestamp, 10),
        )}, ${diffMsBetweenNowAndImport}ms from now.`,
      );

      const movieCount = await this.movieRepository.search().return.count();
      const genreCount = await this.genreRepository.search().return.count();

      this.logger.log(
        `Data store: Movies: ${movieCount}, genres: ${genreCount}`,
      );
      this.logger.log(
        `Db file: Movies: ${this.db.data.movies.length}, genres: ${this.db.data.genres.length}`,
      );

      if (
        movieCount === this.db.data.movies.length &&
        genreCount === this.db.data.genres.length &&
        diffMsBetweenNowAndImport < 5 * 60 * 1000
      ) {
        this.clearData();
        return;
      }

      this.redis.flushDb();
    }

    this.db.data.genres.map(async (genre) =>
      this.queue.add(() => this.addGenre(genre)),
    );

    this.db.data.movies.map(async (movie) =>
      this.queue.add(() => this.addMovie(movie)),
    );

    this.clearData();

    await this.queue.onIdle();
    await this.redisClient.set('database-imported-time', Date.now().toString());
  }
}
