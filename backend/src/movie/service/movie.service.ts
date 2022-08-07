import { Logger, Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Movie } from '../types/movie.type';

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);

  constructor(@Inject('DATABASE_SERVICE') private dbClient: ClientProxy) {}

  async getData(): Promise<Observable<Movie>> {
    const message = await this.dbClient.send<Movie>(
      { cmd: 'get-single-movie' },
      {},
    );

    return message;
  }
}
