import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoGalleryDto } from './dto/create-photo-gallery.dto';
import { UpdatePhotoGalleryDto } from './dto/update-photo-gallery.dto';

@Injectable()
export class PhotoGalleryService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePhotoGalleryDto, imageBuffers: Buffer[]) {
    if (!imageBuffers || imageBuffers.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    if (imageBuffers.length > 20) {
      throw new BadRequestException('Maximum 20 images allowed per gallery');
    }

    return this.prisma.photoGallery.create({
      data: {
        title: createDto.title,
        description: createDto.description,
        category: createDto.category,
        priority: createDto.priority || 0,
        images: {
          create: imageBuffers.map((buffer, index) => ({
            imageData: new Uint8Array(buffer),
            displayOrder: index,
          })),
        },
      },
      include: { images: true },
    });
  }

  async findAll(category?: string) {
    const where = category ? { category: category as any, isActive: true } : { isActive: true };
    
    return this.prisma.photoGallery.findMany({
      where,
      include: { 
        images: {
          orderBy: { displayOrder: 'asc' }
        } 
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
    });
  }

  async findOne(id: string) {
    const gallery = await this.prisma.photoGallery.findUnique({
      where: { id },
      include: { 
        images: {
          orderBy: { displayOrder: 'asc' }
        } 
      },
    });

    if (!gallery) {
      throw new NotFoundException(`Photo Gallery ${id} not found`);
    }

    return gallery;
  }

  async update(id: string, updateDto: UpdatePhotoGalleryDto, imageBuffers?: Buffer[]) {
    await this.findOne(id);

    if (imageBuffers && imageBuffers.length > 0) {
      if (imageBuffers.length > 20) {
        throw new BadRequestException('Maximum 20 images allowed per gallery');
      }

      // Delete existing images and create new ones
      await this.prisma.photoGalleryImage.deleteMany({
        where: { photoGalleryId: id },
      });

      return this.prisma.photoGallery.update({
        where: { id },
        data: {
          ...updateDto,
          images: {
            create: imageBuffers.map((buffer, index) => ({
              imageData: new Uint8Array(buffer),
              displayOrder: index,
            })),
          },
        },
        include: { 
          images: {
            orderBy: { displayOrder: 'asc' }
          } 
        },
      });
    }

    // Update only metadata
    return this.prisma.photoGallery.update({
      where: { id },
      data: updateDto,
      include: { 
        images: {
          orderBy: { displayOrder: 'asc' }
        } 
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.photoGallery.delete({ where: { id } });
  }

  async toggleActive(id: string) {
    const gallery = await this.findOne(id);
    return this.prisma.photoGallery.update({
      where: { id },
      data: { isActive: !gallery.isActive },
      include: { images: true },
    });
  }

  async getImages(id: string) {
    const gallery = await this.findOne(id);
    return gallery.images
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(img => img.imageData);
  }
}
