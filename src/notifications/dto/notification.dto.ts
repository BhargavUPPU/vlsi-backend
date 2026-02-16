import { IsString, IsNotEmpty, IsBoolean, IsInt, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateNotificationDto {


  @IsString()
  @IsOptional()
  message: string;

  @IsOptional()
  @IsString()
  link?: string;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
