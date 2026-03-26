import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import { PhotoGalleryService } from './photo-gallery.service';
import { CreatePhotoGalleryDto } from './dto/create-photo-gallery.dto';
import { UpdatePhotoGalleryDto } from './dto/update-photo-gallery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';

@Controller('photoGallery')
export class PhotoGalleryController {
  constructor(private readonly photoGalleryService: PhotoGalleryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 20))
  create(
    @Body() createPhotoGalleryDto: CreatePhotoGalleryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new Error('At least one image file is required');
    }
    // Ensure priority is a number when using multipart/form-data
    const data = {
      ...createPhotoGalleryDto,
      priority:
        createPhotoGalleryDto.priority &&
        typeof createPhotoGalleryDto.priority === 'string'
          ? parseInt(createPhotoGalleryDto.priority, 10)
          : createPhotoGalleryDto.priority,
    };
    return this.photoGalleryService.create(
      data,
      files.map((f) => f.buffer),
    );
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : undefined;
    return this.photoGalleryService.findAll({ category, page: p, limit: l });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoGalleryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 20))
  update(
    @Param('id') id: string,
    @Body() updatePhotoGalleryDto: UpdatePhotoGalleryDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    // Ensure priority is a number when using multipart/form-data
    const data = {
      ...updatePhotoGalleryDto,
      priority:
        updatePhotoGalleryDto.priority &&
        typeof updatePhotoGalleryDto.priority === 'string'
          ? parseInt(updatePhotoGalleryDto.priority, 10)
          : updatePhotoGalleryDto.priority,
    };
    const imageBuffers =
      files && files.length > 0 ? files.map((f) => f.buffer) : undefined;
    return this.photoGalleryService.update(id, data, imageBuffers);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoGalleryService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.photoGalleryService.toggleActive(id);
  }

  @Get(':id/images')
  async getImages(@Param('id') id: string) {
    const imagesData = await this.photoGalleryService.getImages(id);
    return imagesData.map((data) => Buffer.from(data));
  }

  @Get(':id/image/:imageIndex')
  async getImage(
    @Param('id') id: string,
    @Param('imageIndex') imageIndex: string,
    @Query('size') size?: string,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const index = parseInt(imageIndex, 10);
    const imageBuffer = await this.photoGalleryService.getImageByIndex(id, index, size);
    
    if (res) {
      // Set caching headers for better performance
      res.set({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, immutable', // 24 hours
        'ETag': `"gallery-${id}-${index}-${size || 'original'}"`,
      });
    }
    
    return new StreamableFile(imageBuffer);
  }

  @Get(':id/thumbnail/:imageIndex')
  async getThumbnail(
    @Param('id') id: string,
    @Param('imageIndex') imageIndex: string,
    @Query('size') size?: string,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const index = parseInt(imageIndex, 10);
    // Use provided size or default to 1200 for high-quality thumbnails
    const imageBuffer = await this.photoGalleryService.getImageByIndex(id, index, size || '1200');
    
    if (res) {
      res.set({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=604800, immutable', // 7 days for thumbnails
        'ETag': `"gallery-thumb-${id}-${index}-${size || '1200'}"`,
      });
    }
    
    return new StreamableFile(imageBuffer);
  }
}
