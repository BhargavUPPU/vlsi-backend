import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGatePyqDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  link: string;
}
