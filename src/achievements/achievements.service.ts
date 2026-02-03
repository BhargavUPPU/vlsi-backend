import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAchievementDto } from './dto/achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

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

  async findAll(type?: string) {
    return this.prisma.achievement.findMany({
      where: {
        type: type ? (type as any) : undefined
      },
      include: { images: { select: { id: true } } },
      orderBy: { priority: 'desc' }
    });
  }

  async findActive(type?: string) {
    return this.prisma.achievement.findMany({
      where: {
        isActive: true,
        type: type ? (type as any) : undefined
      },
      include: { images: { select: { id: true } } },
      orderBy: { priority: 'desc' }
    });
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

    return this.prisma.achievement.update({
      where: { id },
      data: {
        ...updateAchievementDto,
        mainImage: mainImage ? new Uint8Array(mainImage) : undefined,
        images: newImages ? {
          create: newImages.map(img => ({ imageData: new Uint8Array(img) }))
        } : undefined
      },
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
    return Buffer.from(achievement.mainImage);
  }

  async getAdditionalImage(imageId: string) {
    const image = await this.prisma.achievementImage.findUnique({
      where: { id: imageId }
    });
    if (!image || !image.imageData) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
    return Buffer.from(image.imageData);
  }
}
