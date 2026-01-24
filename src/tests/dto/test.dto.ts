import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';
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
  title?: string;
  subject?: string;
  type?: string;
  status?: string;
  noOfQuestions?: number;
  duration?: number;
  examLink?: string;
  date?: string;
  description?: string;
}
