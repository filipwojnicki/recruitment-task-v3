import { Entity, Schema } from 'redis-om';

class GenreEntity extends Entity {}

export const GenreSchema = new Schema(GenreEntity, {
  name: { type: 'text' },
});
