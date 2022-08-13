import { Logger, Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MovieDto } from '../dto/movie.dto';
import { MovieEntity } from '../entities/movie.entity';

import { MovieRepository } from '../repository/movie.repository';
import { GenreService } from '../../genre/service/genre.service';

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);

  constructor(
    @Inject('DATABASE_SERVICE') private dbClient: ClientProxy,
    private readonly movieRepository: MovieRepository,
    private readonly genreService: GenreService,
  ) {}

  async createMovie(
    movieDto: MovieDto,
  ): Promise<boolean | Observable<boolean>> {
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

    const validGenres = await this.genreService.serializeGenres(genres);

    if (!validGenres.length) {
      return [];
    }

    return await this.movieRepository.getMoviesByGenres(validGenres);
  }
}
