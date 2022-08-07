import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MovieService } from './service/movie.service';
import { MovieController } from './controller/movie.controller';
import { REDIS } from 'src/conf/redis';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATABASE_SERVICE',
        transport: Transport.REDIS,
        options: { ...REDIS },
      },
    ]),
  ],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
