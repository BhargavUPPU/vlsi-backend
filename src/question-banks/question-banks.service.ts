import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';

@Injectable()
export class QuestionBanksService {
  constructor(private prisma: PrismaService) {}

  create(createQuestionBankDto: CreateQuestionBankDto) {
    return this.prisma.questionBank.create({
      data: createQuestionBankDto,
    });
  }

  findAll() {
    return this.prisma.questionBank.findMany({
      orderBy: { createdAt: 'desc' },
    });
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

  async update(id: string, updateQuestionBankDto: UpdateQuestionBankDto) {
    await this.findOne(id);

    return this.prisma.questionBank.update({
      where: { id },
      data: updateQuestionBankDto,
    });
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
