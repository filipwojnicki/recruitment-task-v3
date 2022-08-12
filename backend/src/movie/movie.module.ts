import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MovieService } from './service/movie.service';
import { MovieController } from './controller/movie.controller';
import { MovieRepository } from './repository/movie.repository';
import { REDIS } from '../conf/redis';
import { RedisModule } from '../redis/redis.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATABASE_SERVICE',
        transport: Transport.REDIS,
        options: { ...REDIS },
      },
    ]),
    RedisModule,
    GenreModule,
  ],
  providers: [MovieService, MovieRepository],
  controllers: [MovieController],
})
export class MovieModule {}
