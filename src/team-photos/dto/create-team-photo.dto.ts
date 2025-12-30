import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTeamPhotoDto {
  @IsString()
  @IsNotEmpty()
  academicYear: string;
}
