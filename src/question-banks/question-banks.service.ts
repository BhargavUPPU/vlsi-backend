import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';

@Injectable()
export class QuestionBanksService {
  constructor(private prisma: PrismaService) {}

  create(createQuestionBankDto: CreateQuestionBankDto, imageBuffer?: Buffer) {
    return this.prisma.questionBank.create({
      data: {
        ...createQuestionBankDto,
        image: imageBuffer ? new Uint8Array(imageBuffer) : null
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
        { topicName: { contains: query.search } },
        { subject: { contains: query.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.questionBank.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.questionBank.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const qb = await this.prisma.questionBank.findUnique({
      where: { id },
    });

    if (!qb) {
      throw new NotFoundException(`Question Bank with ID ${id} not found`);
    }

    return qb;
  }

  async update(id: string, updateQuestionBankDto: UpdateQuestionBankDto, imageBuffer?: Buffer) {
    await this.findOne(id);
    const updateData: any = { ...updateQuestionBankDto };
    if (imageBuffer) updateData.image = new Uint8Array(imageBuffer);

    return this.prisma.questionBank.update({
      where: { id },
      data: updateData,
    });
  }

  async getImage(id: string) {
    const item = await this.findOne(id);
    if (!item.image) throw new NotFoundException(`Image not found`);
    return item.image;
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.questionBank.delete({
      where: { id },
    });
  }

  findBySubject(subject: string) {
    return this.prisma.questionBank.findMany({
      where: { subject },
      orderBy: { createdAt: 'desc' },
    });
  }
}
