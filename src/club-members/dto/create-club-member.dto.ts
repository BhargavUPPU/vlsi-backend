import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClubMemberDto {
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
  rollNumber: string;

  @IsOptional()
  @IsString()
  memberShipId?: string;

  @IsOptional()
  @IsString()
  coreMemberId?: string;
}
