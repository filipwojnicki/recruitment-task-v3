import { Module } from '@nestjs/common';

import { GenreService } from './service/genre.service';
import { GenreRepository } from './repository/genre.repository';

import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [GenreService, GenreRepository],
  exports: [GenreService],
})
export class GenreModule {}
