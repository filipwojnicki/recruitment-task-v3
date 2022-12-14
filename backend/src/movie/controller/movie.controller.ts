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
import { GenreService } from '../../genre/service/genre.service';

import { GENRE_TRANSFORM_REGEX } from '../../common/consts';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('movie')
@ApiTags('movie')
export class MovieController {
  private readonly logger = new Logger(MovieController.name);

  constructor(
    private readonly movieService: MovieService,
    private readonly genreService: GenreService,
  ) {}

  @Post()
  @ApiBody({
    description: 'Add a movie',
    type: MovieDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'A movie has been successfully created.',
    type: Boolean,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server-side error not catched.',
  })
  async createMovie(
    @Body() movieDto: MovieDto,
  ): Promise<boolean | Observable<boolean>> {
    try {
      if (movieDto.genres) {
        const validGenres = await this.genreService.serializeGenres(
          movieDto.genres.map((genre) =>
            genre.replace(GENRE_TRANSFORM_REGEX, ''),
          ),
        );

        if (validGenres.length != movieDto.genres.length) {
          throw new HttpException("Genres aren't correct", 400);
        }

        movieDto.genres = validGenres;
      }

      return await this.movieService.createMovie(movieDto);
    } catch (error) {
      this.logger.debug(
        error.hasOwnProperty('message') ? error.message : JSON.stringify(error),
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Problem with adding a movie.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A movie has been successfully fetched.',
    type: [MovieEntity],
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server-side error not catched.',
  })
  async getMovie(
    @Query() movieQueryDto: MovieQueryDto,
  ): Promise<MovieEntity[]> {
    try {
      if (movieQueryDto.genres) {
        if (!movieQueryDto.genres.length) {
          return [];
        }

        const data = await this.movieService.getMoviesByGenres(
          movieQueryDto.genres,
          movieQueryDto.duration,
        );

        return this.movieService.sortByGenresFrequency(
          data,
          movieQueryDto.genres,
        );
      }

      if (movieQueryDto.duration >= 0) {
        return await this.movieService.getRandomMovie(movieQueryDto.duration);
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
