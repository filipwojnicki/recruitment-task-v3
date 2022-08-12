import { Logger, Injectable, Inject, OnModuleInit } from '@nestjs/common';

import { Client, Repository } from 'redis-om';
import type { RedisClientType } from 'redis';
import { GenreSchema, GenreEntity } from '../entities/genre.entity';

@Injectable()
export class GenreRepository implements OnModuleInit {
  private readonly logger = new Logger(GenreRepository.name);
  private readonly redisClient: Client = new Client();
  private genreRepository: Repository<GenreEntity>;
  private readonly additionalFieldCount = 1;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.redisClient.use(this.redis);
    this.genreRepository = this.redisClient.fetchRepository(GenreSchema);
  }

  async getAllGenres(): Promise<string[]> {
    return (
      await this.genreRepository
        .search()
        .return.all()
        .catch(() => [])
    ).map((genre) => genre.name);
  }
}
