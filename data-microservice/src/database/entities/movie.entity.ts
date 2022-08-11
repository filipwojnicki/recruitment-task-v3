import { Entity, Schema } from 'redis-om';
import { Movie } from '../types/movie.type';

class MovieEntity extends Entity implements Movie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  director: string;
  actors?: string;
  plot?: string;
  posterUrl?: string;
  genres?: string[];
}

export const MovieSchema = new Schema(MovieEntity, {
  id: { type: 'number' },
  title: { type: 'text' },
  year: { type: 'number' },
  runtime: { type: 'number' },
  director: { type: 'string' },
  actors: { type: 'text' },
  plot: { type: 'text' },
  posterUrl: { type: 'string' },
  genres: { type: 'string[]' },
});
