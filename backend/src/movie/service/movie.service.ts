import { Logger, Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MovieDto } from '../dto/movie.dto';
import { MovieEntity } from '../entities/movie.entity';

import { MovieRepository } from '../repository/movie.repository';

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);

  constructor(
    @Inject('DATABASE_SERVICE') private dbClient: ClientProxy,
    private readonly movieRepository: MovieRepository,
  ) {}

  async createMovie(movieDto: MovieDto): Promise<Observable<boolean>> {
    await this.movieRepository.createMovie(movieDto);
    const status = await this.dbClient.send<boolean>(
      { cmd: 'database-changed' },
      {},
    );
    return status;
  }

  async getRandomMovie(duration?: number): Promise<MovieEntity[]> {
    return await this.movieRepository.getRandomOne(duration);
  }

  async getMoviesByGenres(genres: string[]): Promise<MovieEntity[]> {
    if (!genres.length) {
      return [];
    }

    if (genres.length === 1) {
      if (genres[0] === '') {
        return [];
      }
    }

    return await this.movieRepository.getMoviesByGenres(genres);
  }
}
