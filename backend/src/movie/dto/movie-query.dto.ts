import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class MovieQueryDto {
  @IsOptional()
  public duration: string;

  @IsOptional()
  public genres: string[];
}
