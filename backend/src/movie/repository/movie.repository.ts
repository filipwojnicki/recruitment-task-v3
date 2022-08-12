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

  async createMovie(movieDto: MovieDto): Promise<void> {
    const movie = this.movieRepository.createEntity();

    const movieCount = await this.getMovieCount();
    this.logger.debug(movieCount);

    movie.id = movieCount;
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

  async getMovieCount(): Promise<number> {
    return await this.movieRepository
      .search()
      .return.count()
      .catch(() => 0);
  }
}
