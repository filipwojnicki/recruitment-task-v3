import { Entity, Schema } from 'redis-om';

export class GenreEntity extends Entity {
  name: string;
}

export const GenreSchema = new Schema(GenreEntity, {
  name: { type: 'text' },
});
