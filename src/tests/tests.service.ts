import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto, UpdateTestDto } from './dto/test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  create(createTestDto: CreateTestDto) {
    return this.prisma.test.create({
      data: { ...createTestDto, date: new Date(createTestDto.date) },
    });
  }

  findAll() {
    return this.prisma.test.findMany({ orderBy: { date: 'desc' } });
  }

  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({ where: { id } });
    if (!test) throw new NotFoundException(`Test with ID ${id} not found`);
    return test;
  }

  async update(id: string, updateTestDto: UpdateTestDto) {
    await this.findOne(id);
    const data: any = { ...updateTestDto };
    if (updateTestDto.date) data.date = new Date(updateTestDto.date);
    return this.prisma.test.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.test.delete({ where: { id } });
  }

  findByStatus(status: string) {
    return this.prisma.test.findMany({
      where: { status },
      orderBy: { date: 'desc' },
    });
  }

  findBySubject(subject: string) {
    return this.prisma.test.findMany({
      where: { subject },
      orderBy: { date: 'desc' },
    });
  }
}
