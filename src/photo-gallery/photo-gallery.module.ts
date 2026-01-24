import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PhotoGalleryController } from './photo-gallery.controller';
import { PhotoGalleryService } from './photo-gallery.service';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file
        files: 20, // Maximum 20 files
      },
    }),
  ],
  controllers: [PhotoGalleryController],
  providers: [PhotoGalleryService],
})
export class PhotoGalleryModule {}
