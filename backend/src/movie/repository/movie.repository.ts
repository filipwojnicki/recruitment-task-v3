import { Logger, Injectable, Inject, OnModuleInit } from '@nestjs/common';

import { Client, Repository } from 'redis-om';
import type { RedisClientType } from 'redis';
import { MovieEntity, MovieSchema } from '../entities/movie.entity';
import { MovieDto } from '../dto/movie.dto';

@Injectable()
export class MovieRepository implements OnModuleInit {
  private readonly logger = new Logger(MovieRepository.name);
  private readonly redisClient: Client = new Client();
  private movieRepository: Repository<MovieEntity>;
  private readonly additionalFieldCount = 1;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.redisClient.use(this.redis);
    this.movieRepository = this.redisClient.fetchRepository(MovieSchema);
  }

  async getNextMovieId(): Promise<number> {
    try {
      const lastMovie = await this.movieRepository
        .search()
        .sortDescending('id')
        .return.first();

      if (!lastMovie) {
        return 1;
      }

      return lastMovie.id + 1;
    } catch (error) {
      return 1;
    }
  }

  async createMovie(movieDto: MovieDto): Promise<void> {
    const movie = this.movieRepository.createEntity();

    movie.id = await this.getNextMovieId();
    movie.title = movieDto.title;
    movie.year = movieDto.year;
    movie.runtime = movieDto.runtime;
    movie.director = movieDto.director;
    movie.actors = movieDto.actors ?? null;
    movie.plot = movieDto.plot ?? null;
    movie.posterUrl = movieDto.posterUrl ?? null;
    movie.genres = movieDto.genres ?? null;

    await this.movieRepository.save(movie);
  }

  async getRandomOne(duration?: number): Promise<MovieEntity[]> {
    let movieCount = 0;
    let offset = 0;

    if (duration) {
      const durationMin = duration - 10 < 0 ? 0 : duration - 10;
      const durationMax = duration + 10;

      const durationSearchObject = this.movieRepository
        .search()
        .where('runtime')
        .is.greaterThanOrEqualTo(durationMin)
        .and('runtime')
        .is.lessThanOrEqualTo(durationMax);

      movieCount = await durationSearchObject.return.count().catch(() => 0);

      offset = this.randomNumberBetweenRange(0, movieCount - 1);

      return await durationSearchObject.return.page(offset, 1);
    }

    movieCount = await this.getMovieCount();
    offset = this.randomNumberBetweenRange(0, movieCount - 1);

    return await this.movieRepository.search().return.page(offset, 1);
  }

  async getMoviesByGenres(genres: string[]): Promise<MovieEntity[]> {
    return await this.movieRepository
      .search()
      .where('genres')
      .containOneOf(...genres)
      .return.all();
  }

  async getMovieCount(): Promise<number> {
    return await this.movieRepository
      .search()
      .return.count()
      .catch(() => 0);
  }

  getAdditionalFieldCount(): number {
    return this.additionalFieldCount;
  }

  randomNumberBetweenRange(min, max): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
