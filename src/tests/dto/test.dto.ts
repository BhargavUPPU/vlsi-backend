import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';

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

  @IsInt()
  noOfQuestions: number;

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
