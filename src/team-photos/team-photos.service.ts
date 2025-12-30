import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamPhotosService {
  constructor(private prisma: PrismaService) {}

  async create(academicYear: string, imageBuffer: Buffer) {
    return this.prisma.teamPhoto.create({
      data: {
        academicYear,
        imageData: new Uint8Array(imageBuffer),
      },
    });
  }

  findAll() {
    return this.prisma.teamPhoto.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const photo = await this.prisma.teamPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException(`Team Photo ${id} not found`);
    return photo;
  }

  async findByYear(year: string) {
    const photo = await this.prisma.teamPhoto.findUnique({
      where: { academicYear: year },
    });
    if (!photo) throw new NotFoundException(`Team Photo for year ${year} not found`);
    return photo;
  }

  async update(id: string, imageBuffer: Buffer) {
    await this.findOne(id);
    return this.prisma.teamPhoto.update({
      where: { id },
      data: { imageData: new Uint8Array(imageBuffer) },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.teamPhoto.delete({ where: { id } });
  }

  async getImage(id: string) {
    const photo = await this.findOne(id);
    return photo.imageData;
  }
}
