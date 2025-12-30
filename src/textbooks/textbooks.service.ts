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

  findAll() {
    return this.prisma.textBook.findMany({
      orderBy: { createdAt: 'desc' },
    });
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
