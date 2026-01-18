import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VlsiMaterialsService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; category: string; link: string }, imageBuffer?: Buffer) {
    return this.prisma.vlsiMaterial.create({
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
      where.name = { contains: query.search };
    }

    const [data, total] = await Promise.all([
      this.prisma.vlsiMaterial.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vlsiMaterial.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const item = await this.prisma.vlsiMaterial.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`VLSI Material ${id} not found`);
    return item;
  }

  async update(id: string, data: any, imageBuffer?: Buffer) {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (imageBuffer) updateData.image = new Uint8Array(imageBuffer);
    return this.prisma.vlsiMaterial.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.vlsiMaterial.delete({ where: { id } });
  }

  findByCategory(category: string) {
    return this.prisma.vlsiMaterial.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getImage(id: string) {
    const item = await this.findOne(id);
    if (!item.image) throw new NotFoundException(`Image not found`);
    return item.image;
  }
}
