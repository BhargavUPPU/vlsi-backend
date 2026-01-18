import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamPhotosService {
  constructor(private prisma: PrismaService) {}

  async create(academicYear: string, imageBuffers: Buffer[]) {
    return this.prisma.teamPhoto.create({
      data: {
        academicYear,
        images: {
          create: imageBuffers.slice(0, 5).map(buffer => ({
            imageData: new Uint8Array(buffer),
          })),
        },
      },
      include: { images: true },
    });
  }

  findAll() {
    return this.prisma.teamPhoto.findMany({
      include: { images: true },
      orderBy: { academicYear: 'desc' },
    });
  }

  async findOne(id: string) {
    const photo = await this.prisma.teamPhoto.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!photo) throw new NotFoundException(`Team Photo ${id} not found`);
    return photo;
  }

  async findByYear(year: string) {
    const photo = await this.prisma.teamPhoto.findUnique({
      where: { academicYear: year },
      include: { images: true },
    });
    if (!photo) throw new NotFoundException(`Team Photo for year ${year} not found`);
    return photo;
  }

  async update(id: string, imageBuffers: Buffer[]) {
    await this.findOne(id);
    
    // Simple approach: delete existing images and create new ones
    await this.prisma.teamPhotoImage.deleteMany({
      where: { teamPhotoId: id },
    });

    return this.prisma.teamPhoto.update({
      where: { id },
      data: {
        images: {
          create: imageBuffers.slice(0, 5).map(buffer => ({
            imageData: new Uint8Array(buffer),
          })),
        },
      },
      include: { images: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.teamPhoto.delete({ where: { id } });
  }

  async getImages(id: string) {
    const photo = await this.findOne(id);
    return photo.images.map(img => img.imageData);
  }
}
