import { Entity, Schema } from 'redis-om';

export class GenreEntity extends Entity {}

export const GenreSchema = new Schema(GenreEntity, {
  name: { type: 'text' },
});
