import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MovieService } from './service/movie.service';
import { MovieController } from './controller/movie.controller';
import { MovieRepository } from './repository/movie.repository';
import { REDIS } from '../conf/redis';
import { RedisModule } from '../redis/redis.module';

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
  ],
  providers: [MovieService, MovieRepository],
  controllers: [MovieController],
})
export class MovieModule {}
