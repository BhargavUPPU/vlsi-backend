import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCoreMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsString()
  @IsNotEmpty()
  sectionBranch: string;

  @IsString()
  @IsNotEmpty()
  portfolio: string;

  @IsString()
  @IsNotEmpty()
  rollNumber: string;

  @IsString()
  @IsNotEmpty()
  category: string; // e.g., "Technical", "Events", "Media"

  @IsOptional()
  @IsString()
  teamCategory?: string; // e.g., "Executive Team", "Events Organizing Team"

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  memberShipId?: string;
}
