import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

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
  public duration: number = 0;

  @Transform(({ value }) =>
    value
      .replace(/\s/g, '')
      .replace(/[^a-z,-]/gi, '')
      .split(','),
  )
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public genres: string[];
}
