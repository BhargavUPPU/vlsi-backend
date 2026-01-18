import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min } from 'class-validator';

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

  @IsInt()
  @Min(0)
  @IsOptional()
  priority?: number;
}
