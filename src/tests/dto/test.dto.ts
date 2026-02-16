import { IsString, IsNotEmpty, IsInt, IsDateString, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  type: string; // weekend, basic-conceptual, theoretical, quiz

  @IsString()
  @IsNotEmpty()
  status: string; // completed, ongoing

  @Transform(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  })
  @Type(() => Number)
  @IsInt()
  noOfQuestions: number;

  @Transform(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  })
  @Type(() => Number)
  @IsInt()
  duration: number; // in minutes

  @IsString()
  @IsNotEmpty()
  examLink: string;

  @IsDateString()
  date: string;

  @IsString()
  description?: string;
}

export class UpdateTestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @Transform(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  noOfQuestions?: number;

  @Transform(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  duration?: number; // in minutes

  @IsOptional()
  @IsString()
  examLink?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
