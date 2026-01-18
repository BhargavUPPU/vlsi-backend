// NPTEL Lectures - Simple resource with images
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NptelLecturesService {
  constructor(private prisma: PrismaService) {}

  create(data: { courseName: string; professorName: string; link: string }, imageBuffer?: Buffer) {
    return this.prisma.nptelLecture.create({
      data: { ...data, image: imageBuffer ? new Uint8Array(imageBuffer) : null },
    });
  }

  async findAll(query?: { search?: string; category?: string; page?: string; limit?: string }) {
    const page = parseInt(query?.page || '1');
    const limit = parseInt(query?.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query?.category && query.category !== 'All') {
      where.category = query.category;
    }
    if (query?.search) {
      where.OR = [
        { courseName: { contains: query.search } },
        { professorName: { contains: query.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.nptelLecture.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.nptelLecture.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const lecture = await this.prisma.nptelLecture.findUnique({ where: { id } });
    if (!lecture) throw new NotFoundException(`NPTEL Lecture ${id} not found`);
    return lecture;
  }

  async update(id: string, data: any, imageBuffer?: Buffer) {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (imageBuffer) updateData.image = new Uint8Array(imageBuffer);
    return this.prisma.nptelLecture.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.nptelLecture.delete({ where: { id } });
  }

  async getImage(id: string) {
    const lecture = await this.findOne(id);
    if (!lecture.image) throw new NotFoundException(`Image not found`);
    return lecture.image;
  }
}
