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

import { Movie } from '../interface/movie.interface';
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
    if (movieQueryDto.duration > 0) {
      return await this.movieService.getRandomMovie(movieQueryDto.duration);
    }

    return await this.movieService.getRandomMovie();
  }
}
