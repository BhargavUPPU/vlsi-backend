import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClubMemberDto } from './dto/create-club-member.dto';
import { UpdateClubMemberDto } from './dto/update-club-member.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClubMembersService {
  constructor(private prisma: PrismaService) {}

  async create(createClubMemberDto: CreateClubMemberDto) {
    return this.prisma.clubMembers.create({
      data: createClubMemberDto,
    });
  }

  async findAll() {
    return this.prisma.clubMembers.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.clubMembers.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Club member with ID ${id} not found`);
    }

    return member;
  }

  async update(id: string, updateClubMemberDto: UpdateClubMemberDto) {
    await this.findOne(id);

    return this.prisma.clubMembers.update({
      where: { id },
      data: updateClubMemberDto ,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.clubMembers.delete({
      where: { id },
    });
  }

  async findByYear(year: string) {
    return this.prisma.clubMembers.findMany({
      where: { academicYear: year },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findBySection(section: string) {
    return this.prisma.clubMembers.findMany({
      where: { sectionBranch: section },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
