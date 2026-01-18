import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoGalleryDto } from './create-photo-gallery.dto';

export class UpdatePhotoGalleryDto extends PartialType(CreatePhotoGalleryDto) {}
