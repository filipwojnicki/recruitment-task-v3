/**
 * Movie type
 * - id (required, number)
 * - title (required, string, max 255 characters)
 * - year (required, number)
 * - runtime (required, number)
 * - director (required, string, max 255 characters)
 * - actors (optional, string)
 * - plot (optional, string)
 * - posterUrl (optional, string)
 * - genres (optional, string array)
 */

export type Movie = {
  id: number;
  title: string;
  year: number;
  runtime: number;
  director: string;
  actors?: string;
  plot?: string;
  posterUrl?: string;
  genres?: string[];
};
