import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePhotoGalleryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['CLUB_HIGHLIGHTS', 'PHOTO_GALLERY', 'BOTH'])
  @IsNotEmpty()
  category: 'CLUB_HIGHLIGHTS' | 'PHOTO_GALLERY' | 'BOTH';

  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  priority?: number;
}
