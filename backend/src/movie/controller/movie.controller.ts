import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { MovieService } from '../service/movie.service';

import { MovieDto } from '../dto/movie.dto';
import { MovieQueryDto } from '../dto/movie-query.dto';
import { MovieEntity } from '../entities/movie.entity';
import { Observable } from 'rxjs';

@Controller('movie')
export class MovieController {
  private readonly logger = new Logger(MovieController.name);

  constructor(private readonly movieService: MovieService) {}

  @Post()
  async createMovie(@Body() movieDto: MovieDto): Promise<Observable<boolean>> {
    try {
      return await this.movieService.createMovie(movieDto);
    } catch (error) {
      this.logger.debug(
        error.hasOwnProperty('message') ? error.message : JSON.stringify(error),
      );

      throw new HttpException(
        'Problem with adding a movie.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getMovie(
    @Query() movieQueryDto: MovieQueryDto,
  ): Promise<MovieEntity[]> {
    try {
      if (movieQueryDto.duration > 0) {
        return await this.movieService.getRandomMovie(movieQueryDto.duration);
      }

      if (movieQueryDto.genres) {
        if (!movieQueryDto.genres.length) {
          return [];
        }

        return await this.movieService.getMoviesByGenres(movieQueryDto.genres);
      }

      return await this.movieService.getRandomMovie();
    } catch (error) {
      this.logger.error(
        error.hasOwnProperty('message') ? error.message : JSON.stringify(error),
      );

      throw new HttpException(
        'Problem with getting a movie.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
