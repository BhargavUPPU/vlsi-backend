import {
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
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

  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  priority?: number;

  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'true' || lowerValue === '1') return true;
      if (lowerValue === 'false' || lowerValue === '0') return false;
    }
    return Boolean(value);
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
