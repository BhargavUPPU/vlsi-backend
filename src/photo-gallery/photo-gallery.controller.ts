import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
    return this.photoGalleryService.create(
      createPhotoGalleryDto,
      files.map(f => f.buffer),
    );
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.photoGalleryService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoGalleryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 20))
  update(
    @Param('id') id: string,
    @Body() updatePhotoGalleryDto: UpdatePhotoGalleryDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const imageBuffers = files && files.length > 0 ? files.map(f => f.buffer) : undefined;
    return this.photoGalleryService.update(id, updatePhotoGalleryDto, imageBuffers);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoGalleryService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.photoGalleryService.toggleActive(id);
  }

  @Get(':id/images')
  async getImages(@Param('id') id: string) {
    const imagesData = await this.photoGalleryService.getImages(id);
    return imagesData.map(data => Buffer.from(data));
  }
}
