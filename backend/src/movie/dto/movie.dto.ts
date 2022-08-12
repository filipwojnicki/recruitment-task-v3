import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Movie } from '../interface/movie.interface';

/**
 * Movie DTO
 * - title (required, string, max 255 characters)
 * - year (required, number)
 * - runtime (required, number)
 * - director (required, string, max 255 characters)
 * - actors (optional, string)
 * - plot (optional, string)
 * - posterUrl (optional, string)
 * - genres (optional, string array)
 */

export class MovieDto implements Movie {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsInt()
  @Min(1880)
  @Max(9999)
  year: number;

  @IsInt()
  @Min(1)
  @Max(9999)
  runtime: number;

  @IsString()
  @Length(1, 255)
  director: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  actors?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  plot?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  posterUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];
}
