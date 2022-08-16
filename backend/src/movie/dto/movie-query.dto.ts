import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Max } from 'class-validator';
import { GENRE_TRANSFORM_REGEX } from '../../common/consts';

function toPositiveNumber(value: string): number {
  let newValue: number = Number.parseInt(value, 10);

  return Math.abs(newValue);
}

export class MovieQueryDto {
  @Transform(({ value }) => toPositiveNumber(value))
  @IsOptional()
  @IsInt()
  @Max(9999)
  @ApiProperty({
    description: 'Duration of the movie in minutes',
    example: 90,
  })
  @ApiPropertyOptional()
  public duration: number;

  @Transform(({ value }) =>
    value.replace(/\s/g, '').replace(GENRE_TRANSFORM_REGEX, '').split(','),
  )
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description:
      'Array with genres of the movie, listed after the comma sign in one parameter',
    type: String,
    example: 'Drama, Romance',
  })
  @ApiPropertyOptional()
  public genres: string[];
}
