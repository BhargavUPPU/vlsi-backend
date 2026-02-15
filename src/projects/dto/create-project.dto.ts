import { IsString, IsNotEmpty, IsOptional, IsArray, IsDateString,IsEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  // the `images` field is handled by separate endpoints; any attempt to send it
  // with the basic DTO is almost always a mistake.  Block it explicitly so that
  // clients get a validation error instead of a mysterious Prisma/database
  // error later.
  @IsOptional()
  @IsEmpty({ message: 'images must not be provided; use /projects/:id/images' })
  images?: any;

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
