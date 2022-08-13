import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Max } from 'class-validator';
import { GENRE_TRANSFORM_REGEX } from '../../common/consts';

function toPositiveNumber(value: string): number {
  let newValue: number = Number.parseInt(value, 10);

  if (Number.isNaN(newValue)) {
    newValue = 0;
  }

  return Math.abs(newValue);
}

export class MovieQueryDto {
  @Transform(({ value }) => toPositiveNumber(value))
  @IsOptional()
  @IsInt()
  @Max(9999)
  public duration: number = 0;

  @Transform(({ value }) =>
    value.replace(/\s/g, '').replace(GENRE_TRANSFORM_REGEX, '').split(','),
  )
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public genres: string[];
}
