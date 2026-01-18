import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTextbookDto, UpdateTextbookDto } from './dto/textbook.dto';

@Injectable()
export class TextbooksService {
  constructor(private prisma: PrismaService) {}

  create(createTextbookDto: CreateTextbookDto, imageBuffer?: Buffer) {
    return this.prisma.textBook.create({
      data: {
        ...createTextbookDto,
        image: imageBuffer ? new Uint8Array(imageBuffer) : null,
      },
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
        { name: { contains: query.search } },
        { author: { contains: query.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.textBook.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.textBook.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const textbook = await this.prisma.textBook.findUnique({ where: { id } });
    if (!textbook) throw new NotFoundException(`Textbook with ID ${id} not found`);
    return textbook;
  }

  async update(id: string, updateTextbookDto: UpdateTextbookDto, imageBuffer?: Buffer) {
    await this.findOne(id);
    const data: any = { ...updateTextbookDto };
    if (imageBuffer) data.image = new Uint8Array(imageBuffer);
    return this.prisma.textBook.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.textBook.delete({ where: { id } });
  }

  findBySubject(subject: string) {
    return this.prisma.textBook.findMany({
      where: { subject },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getImage(id: string) {
    const textbook = await this.findOne(id);
    if (!textbook.image) throw new NotFoundException(`Image not found for textbook ${id}`);
    return textbook.image;
  }
}
