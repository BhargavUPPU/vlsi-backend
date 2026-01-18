import { IsEnum, IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { AchievementType } from '@prisma/client';

export class CreateAchievementDto {
  @IsEnum(AchievementType)
  type: AchievementType;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  value?: string;

  @IsInt()
  @IsOptional()
  priority?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
