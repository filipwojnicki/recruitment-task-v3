import { Injectable, Logger } from '@nestjs/common';
import { GenreRepository } from '../repository/genre.repository';

@Injectable()
export class GenreService {
  private readonly logger = new Logger(GenreService.name);

  constructor(private readonly genreRepository: GenreRepository) {}

  async validateGenres(genresToValidate: string[]): Promise<boolean> {
    const genres = await this.genreRepository.getAllGenres();

    return genresToValidate.every((genre) => genres.includes(genre));
  }

  async serializeGenres(genres: string[]): Promise<string[]> {
    if (!genres.length) {
      return [];
    }

    return await this.genreRepository.serializeGenres(genres).catch(() => []);
  }
}
