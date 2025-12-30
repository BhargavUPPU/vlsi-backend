import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GatePyqsService {
  constructor(private prisma: PrismaService) {}

  create(data: { year: number; link: string; name: string }) {
    return this.prisma.gatePyqs.create({ data });
  }

  findAll() {
    return this.prisma.gatePyqs.findMany({ orderBy: { year: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.gatePyqs.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`GATE PYQ ${id} not found`);
    return item;
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.gatePyqs.update({ where: { id }, data });
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
