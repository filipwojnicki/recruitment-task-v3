import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { MovieService } from '../service/movie.service';

import { Movie } from '../interface/movie.interface';
import { MovieDto } from '../dto/movie.dto';

@Controller('movie')
export class MovieController {
  private readonly logger = new Logger(MovieController.name);

  constructor(private readonly movieService: MovieService) {}

  @Post()
  async createMovie(@Body() movieDto: MovieDto) {
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
}
