import { IsString, IsNotEmpty, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateNotificationDto {


  @IsString()
  @IsOptional()
  message: string;

  @IsOptional()
  @IsString()
  link?: string;
}

export class UpdateNotificationDto {
  message?: string;
  link?: string;
}
