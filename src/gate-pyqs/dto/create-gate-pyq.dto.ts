import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateGatePyqDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1990)
  @Max(2100)
  year: number;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsOptional()
  category?: string;
}
