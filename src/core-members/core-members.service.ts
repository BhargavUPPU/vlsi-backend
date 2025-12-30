import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoreMemberDto } from './dto/create-core-member.dto';
import { UpdateCoreMemberDto } from './dto/update-core-member.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoreMembersService {
  constructor(private prisma: PrismaService) {}

  async create(createCoreMemberDto: CreateCoreMemberDto, imageBuffer?: Buffer) {
    const data: any = { ...createCoreMemberDto };
    if (imageBuffer) {
      data.imageUrl = new Uint8Array(imageBuffer);
    }

    return this.prisma.coreMembers.create({
      data: data,
      include: {
        clubMember: true,
      },
    });
  }

  async findAll() {
    return this.prisma.coreMembers.findMany({
      include: {
        clubMember: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.coreMembers.findUnique({
      where: { id },
      include: {
        clubMember: true,
      },
    });

    if (!member) {
      throw new NotFoundException(`Core member with ID ${id} not found`);
    }

    return member;
  }

  async update(id: string, updateCoreMemberDto: UpdateCoreMemberDto, imageBuffer?: Buffer) {
    await this.findOne(id);

    const data: any = { ...updateCoreMemberDto };
    if (imageBuffer) {
      data.imageUrl = new Uint8Array(imageBuffer);
    }

    return this.prisma.coreMembers.update({
      where: { id },
      data: data,
      include: {
        clubMember: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.coreMembers.delete({
      where: { id },
    });
  }

  async getImage(id: string) {
    const member = await this.findOne(id);
    
    if (!member.imageUrl) {
      throw new NotFoundException(`Image not found for core member ${id}`);
    }

    return member.imageUrl;
  }

  async findByCategory(category: string) {
    return this.prisma.coreMembers.findMany({
      where: { category },
      include: {
        clubMember: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findByTeamCategory(teamCategory: string) {
    return this.prisma.coreMembers.findMany({
      where: { teamCategory },
      include: {
        clubMember: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findByYear(year: string) {
    return this.prisma.coreMembers.findMany({
      where: { academicYear: year },
      include: {
        clubMember: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
