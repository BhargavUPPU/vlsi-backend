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

  findAll() {
    return this.prisma.nptelLecture.findMany({ orderBy: { createdAt: 'desc' } });
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
