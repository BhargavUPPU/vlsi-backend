import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
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
            imageData: Buffer.from(buffer),
            displayOrder: index,
          })),
        },
      },
      include: { images: true },
    });
  }

  async findAll(filters?: { category?: string; page?: number; limit?: number; includeImages?: boolean }) {
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : undefined;
    const includeImages = filters?.includeImages === true;
    
    const where = filters?.category ? { category: filters.category as any, isActive: true } : { isActive: true };
    
    const [data, total] = await Promise.all([
      this.prisma.photoGallery.findMany({
        where,
        include: includeImages ? { 
          images: {
            orderBy: { displayOrder: 'asc' }
          } 
        } : {
          images: {
            select: { id: true, displayOrder: true, caption: true }, // Only metadata, no image data
            orderBy: { displayOrder: 'asc' }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: limit ? (page - 1) * limit : undefined,
      }),
      this.prisma.photoGallery.count({ where })
    ]);

    return { data, total, page, limit: limit || total };
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
              imageData: Buffer.from(buffer),
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

  async getImageByIndex(id: string, imageIndex: number, size?: string): Promise<Buffer> {
    const gallery = await this.prisma.photoGallery.findUnique({
      where: { id },
      include: {
        images: {
          where: { displayOrder: imageIndex },
          select: { imageData: true }
        }
      },
    });

    if (!gallery || !gallery.images[0]) {
      throw new NotFoundException(`Image ${imageIndex} not found in gallery ${id}`);
    }

    const originalBuffer = Buffer.from(gallery.images[0].imageData);

    // If no size specified, return original
    if (!size) {
      return originalBuffer;
    }

    // Resize image using Sharp
    const sizeNumber = parseInt(size, 10);
    if (isNaN(sizeNumber) || sizeNumber <= 0) {
      return originalBuffer;
    }

    try {
      // For high-quality thumbnails, maintain aspect ratio while covering the area
      const optimizedBuffer = await sharp(originalBuffer)
        .resize(sizeNumber, Math.round(sizeNumber * 0.75), {
          fit: 'contain',
          position: 'center'
        })
        .jpeg({
          quality: 90, // High quality for all sizes
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();
        
      return optimizedBuffer;
    } catch (error) {
      console.warn('Sharp image processing failed, returning original:', error.message);
      return originalBuffer;
    }
  }
}
