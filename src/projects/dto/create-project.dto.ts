import { IsString, IsNotEmpty, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  status: string; // e.g., "Completed", "Ongoing"

  @IsString()
  @IsNotEmpty()
  Introduction: string;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsString()
  @IsNotEmpty()
  Mentor: string;

  @IsString()
  @IsNotEmpty()
  category: string; // e.g., "VLSI Design", "Embedded Systems"

  @IsOptional()
  Members?: any; // JSON array of members

  @IsOptional()
  @IsString()
  Statement?: string;

  @IsOptional()
  @IsString()
  Abstract?: string;

  @IsOptional()
  @IsString()
  Conclusion?: string;

  @IsOptional()
  @IsString()
  Results?: string;

  @IsOptional()
  @IsString()
  futureScope?: string;

  @IsOptional()
  referenceLinks?: any; // JSON array

  @IsOptional()
  Tools?: any; // JSON array

  @IsOptional()
  @IsString()
  Link?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  Methodology?: string;
}
