import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GatePyqsService {
  constructor(private prisma: PrismaService) {}

  create(data: { year: number | string; link: string; name: string, category?: string }, imageBuffer?: Buffer) {
    return this.prisma.gatePyqs.create({ 
      data: { 
        ...data, 
        year: typeof data.year === 'string' ? parseInt(data.year) : data.year,
        image: imageBuffer ? new Uint8Array(imageBuffer) : null 
      } 
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
      where.name = { contains: query.search };
    }

    const [data, total] = await Promise.all([
      this.prisma.gatePyqs.findMany({
        where,
        skip,
        take: limit,
        orderBy: { year: 'desc' },
      }),
      this.prisma.gatePyqs.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const item = await this.prisma.gatePyqs.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`GATE PYQ ${id} not found`);
    return item;
  }

  async update(id: string, data: any, imageBuffer?: Buffer) {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (data.year) updateData.year = parseInt(data.year);
    if (imageBuffer) updateData.image = new Uint8Array(imageBuffer);
    return this.prisma.gatePyqs.update({ where: { id }, data: updateData });
  }

  async getImage(id: string) {
    const item = await this.findOne(id);
    if (!item.image) throw new NotFoundException(`Image not found`);
    return item.image;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.gatePyqs.delete({ where: { id } });
  }

  findByYear(year: number) {
    return this.prisma.gatePyqs.findMany({
      where: { year },
      orderBy: { createdAt: 'desc' },
    });
  }
}
