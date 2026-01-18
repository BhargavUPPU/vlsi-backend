import { Module } from '@nestjs/common';
import { PhotoGalleryController } from './photo-gallery.controller';
import { PhotoGalleryService } from './photo-gallery.service';

@Module({
  controllers: [PhotoGalleryController],
  providers: [PhotoGalleryService]
})
export class PhotoGalleryModule {}
