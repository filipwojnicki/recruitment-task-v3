import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Schema } from 'redis-om';
import { Movie } from '../interface/movie.interface';

export class MovieEntity extends Entity implements Movie {
  @ApiProperty({
    description: 'Id of the movie',
  })
  id: number;

  @ApiProperty({
    description: 'Title of the movie',
  })
  title: string;

  @ApiProperty({
    description: 'Year of the movie premier',
  })
  year: number;

  @ApiProperty({
    description: 'Duration of the movie in minutes',
  })
  runtime: number;

  @ApiProperty({
    description: 'Director of the movie',
  })
  director: string;

  @ApiProperty({
    description: 'Actors of the movie',
  })
  @ApiPropertyOptional()
  actors?: string;

  @ApiProperty({
    description: 'Plot of the movie',
  })
  @ApiPropertyOptional()
  plot?: string;

  @ApiProperty({
    description: 'Link to poster of the movie',
  })
  @ApiPropertyOptional()
  posterUrl?: string;

  @ApiProperty({
    description: 'Array with the movie genres',
  })
  @ApiPropertyOptional()
  genres?: string[];
}

export const MovieSchema = new Schema(MovieEntity, {
  id: { type: 'number', sortable: true },
  title: { type: 'text' },
  year: { type: 'number' },
  runtime: { type: 'number' },
  director: { type: 'string' },
  actors: { type: 'text' },
  plot: { type: 'text' },
  posterUrl: { type: 'string' },
  genres: { type: 'string[]' },
});
