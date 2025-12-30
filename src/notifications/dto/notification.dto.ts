import { IsString, IsNotEmpty, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  priority?: number;
}

export class UpdateNotificationDto {
  title?: string;
  message?: string;
  link?: string;
  isActive?: boolean;
  priority?: number;
}
