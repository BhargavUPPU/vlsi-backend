import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAchievementDto } from './dto/achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import * as sharp from 'sharp';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async create(createAchievementDto: CreateAchievementDto, mainImage?: Buffer, images?: Buffer[]) {
    const achievement = await this.prisma.achievement.create({
      data: {
        ...createAchievementDto,
        mainImage: mainImage ? new Uint8Array(mainImage) : null,
        images: images ? {
          create: images.map(img => ({ imageData: new Uint8Array(img) }))
        } : undefined
      },
      include: { images: true }
    });
    return achievement;
  }

  async findAll(filters?: { type?: string; page?: number; limit?: number }) {
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : undefined;
    
    const where = {
      type: filters?.type ? (filters.type as any) : undefined
    };

    const [data, total] = await Promise.all([
      this.prisma.achievement.findMany({
        where,
        include: { 
          images: { 
            select: { id: true },
            where: { imageData: { not: new Uint8Array() } } // Only include images with actual data
          } 
        },
        orderBy: { priority: 'desc' },
        take: limit,
        skip: limit ? (page - 1) * limit : undefined,
      }),
      this.prisma.achievement.count({ where })
    ]);

    return { data, total, page, limit: limit || total };
  }

  async findActive(filters?: { type?: string; page?: number; limit?: number }) {
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : undefined;
    
    const where = {
      isActive: true,
      type: filters?.type ? (filters.type as any) : undefined
    };

    const [data, total] = await Promise.all([
      this.prisma.achievement.findMany({
        where,
        include: { 
          images: { 
            select: { id: true },
            where: { imageData: { not: new Uint8Array()  } } // Only include images with actual data
          } 
        },
        orderBy: { priority: 'desc' },
        take: limit,
        skip: limit ? (page - 1) * limit : undefined,
      }),
      this.prisma.achievement.count({ where })
    ]);

    return { data, total, page, limit: limit || total };
  }

  async findOne(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!achievement) throw new NotFoundException(`Achievement with ID ${id} not found`);
    return achievement;
  }

  async update(id: string, updateAchievementDto: UpdateAchievementDto, mainImage?: Buffer, newImages?: Buffer[], existingImageIds?: string[]) {
    await this.findOne(id);

    // If existingImageIds is provided, delete images not in the list
    if (existingImageIds) {
      await this.prisma.achievementImage.deleteMany({
        where: {
          achievementId: id,
          id: { notIn: existingImageIds }
        }
      });
    }

    const updateData: any = { ...updateAchievementDto };
    if (mainImage) updateData.mainImage = new Uint8Array(mainImage);
    if (newImages) updateData.images = {
      create: newImages.map(img => ({ imageData: new Uint8Array(img) }))
    };

    // If no other fields are changing (e.g. only images were deleted), ensure
    // the achievement's `updatedAt` is touched so clients see a new timestamp.
    if (Object.keys(updateData).length === 0) {
      updateData.updatedAt = new Date();
    }

    return this.prisma.achievement.update({
      where: { id },
      data: updateData,
      include: { images: true }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.achievement.delete({ where: { id } });
  }

  async getMainImage(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
      select: { mainImage: true }
    });
    if (!achievement || !achievement.mainImage) {
      throw new NotFoundException(`Main image for achievement ${id} not found`);
    }
    const imageBuffer=Buffer.from(achievement.mainImage);
    try {
      console.log(`Starting Sharp processing for image ${id}`);
      // Generate optimized thumbnail with Sharp
      const thumbnail = await sharp(imageBuffer)
      .resize(1200, 900, { 
        fit: 'contain', 
        position: 'center',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
        .jpeg({ 
          quality: 86, 
          progressive: true,
          mozjpeg: true 
        })
        .toBuffer();
      
      console.log(`Successfully generated thumbnail for ${id}, size: ${thumbnail.length} bytes`);
      return thumbnail;
    } catch (error) {
      // Fallback: return original image if Sharp processing fails
      console.error(`Sharp processing failed for image ${id}:`, error.message);
      console.log(`Using original image as fallback for ${id}`);
      return imageBuffer;
    }
  }

  async getAdditionalImage(imageId: string) {
    const image = await this.prisma.achievementImage.findUnique({
      where: { id: imageId }
    });
    if (!image || !image.imageData) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
   const imageBuffer= Buffer.from(image.imageData);
   try {
    console.log(`Starting Sharp processing for image ${imageId}`);
    // Generate optimized thumbnail with Sharp
    const thumbnail = await sharp(imageBuffer)
    .resize(800, 600, { 
      fit: 'contain', 
      position: 'center',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
      .jpeg({ 
        quality: 92, 
        progressive: true,
        mozjpeg: true 
      })
      .toBuffer();
    
    console.log(`Successfully generated thumbnail for ${imageId}, size: ${thumbnail.length} bytes`);
    return thumbnail;
  } catch (error) {
    // Fallback: return original image if Sharp processing fails
    console.error(`Sharp processing failed for image ${imageId}:`, error.message);
    console.log(`Using original image as fallback for ${imageId}`);
    return imageBuffer;
  }
  }

  async getAdditionalImageThumbnail(imageId: string) {
    console.log(`Thumbnail request for image ID: ${imageId}`);
    
    const image = await this.prisma.achievementImage.findUnique({
      where: { id: imageId }
    });
    
    if (!image || !image.imageData) {
      console.warn(`Image with ID ${imageId} not found or no image data`);
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
    
    console.log(`Found image data for ${imageId}, size: ${image.imageData.length} bytes`);
    const imageBuffer = Buffer.from(image.imageData);
    
    try {
      console.log(`Starting Sharp processing for image ${imageId}`);
      // Generate optimized thumbnail with Sharp
      const thumbnail = await sharp(imageBuffer)
      .resize(800, 600, { 
        fit: 'contain', 
        position: 'center',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
        .jpeg({ 
          quality: 92, 
          progressive: true,
          mozjpeg: true 
        })
        .toBuffer();
      
      console.log(`Successfully generated thumbnail for ${imageId}, size: ${thumbnail.length} bytes`);
      return thumbnail;
    } catch (error) {
      // Fallback: return original image if Sharp processing fails
      console.error(`Sharp processing failed for image ${imageId}:`, error.message);
      console.log(`Using original image as fallback for ${imageId}`);
      return imageBuffer;
    }
  }
}
