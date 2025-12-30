// Placement Prep, VLSI Materials, Magazines - Similar pattern with images
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlacementPrepService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; link: string }, imageBuffer?: Buffer) {
    return this.prisma.placementPrep.create({
      data: { ...data, image: imageBuffer ? new Uint8Array(imageBuffer) : null },
    });
  }

  findAll() {
    return this.prisma.placementPrep.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.placementPrep.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Placement Prep ${id} not found`);
    return item;
  }

  async update(id: string, data: any, imageBuffer?: Buffer) {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (imageBuffer) updateData.image = new Uint8Array(imageBuffer);
    return this.prisma.placementPrep.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.placementPrep.delete({ where: { id } });
  }

  async getImage(id: string) {
    const item = await this.findOne(id);
    if (!item.image) throw new NotFoundException(`Image not found`);
    return item.image;
  }
}
