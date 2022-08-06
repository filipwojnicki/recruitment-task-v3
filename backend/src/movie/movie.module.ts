import { Module } from '@nestjs/common';
import { MovieService } from './service/movie.service';
import { MovieController } from './controller/movie.controller';

@Module({
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
