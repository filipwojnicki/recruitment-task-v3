import { Controller, Get } from '@nestjs/common';
import { MovieService } from '../service/movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getMovie() {
    return this.movieService.getData();
  }
}
