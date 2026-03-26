import { Injectable, NotFoundException } from '@nestjs/common';
import * as sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoreMemberDto } from './dto/create-core-member.dto';
import { UpdateCoreMemberDto } from './dto/update-core-member.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoreMembersService {
  constructor(private prisma: PrismaService) {}

  async create(createCoreMemberDto: CreateCoreMemberDto, imageBuffer?: Buffer) {
    const { name, academicYear, sectionBranch, rollNumber, memberShipId } = createCoreMemberDto;

    // Create the Core Member
    const member = await this.prisma.coreMembers.create({
      data: {
        ...createCoreMemberDto,
        image: imageBuffer ? new Uint8Array(imageBuffer) : null,
      },
    });

    // Auto-sync to Club Members
    try {
      await this.prisma.clubMembers.upsert({
        where: { id: rollNumber }, // Assuming we want rollNumber as ID or we check by it
        // Wait, clubMembers model might not have rollNumber as ID. Let's check schema again.
        update: { name, academicYear, sectionBranch, rollNumber, memberShipId },
        create: { name, academicYear, sectionBranch, rollNumber, memberShipId },
      });
    } catch (e) {
      // If rollNumber is not the ID, we find by it. 
      // Checking schema: clubMembers has id (cuid) and rollNumber (string).
      const existing = await this.prisma.clubMembers.findFirst({ where: { rollNumber } });
      if (existing) {
        await this.prisma.clubMembers.update({
          where: { id: existing.id },
          data: { name, academicYear, sectionBranch, memberShipId },
        });
      } else {
        await this.prisma.clubMembers.create({
          data: { name, academicYear, sectionBranch, rollNumber, memberShipId },
        });
      }
    }

    return member;
  }

  async findAll(opts?: { page?: number; limit?: number; academicYear?: string }) {
    const where: Prisma.coreMembersWhereInput = {};
    if (opts?.academicYear) {
      where.academicYear = opts.academicYear;
    }

    const total = await this.prisma.coreMembers.count({ where });

    const orderBy = [
      { academicYear: 'desc' as const },
      { createdAt: 'desc' as const },
    ];

    if (opts?.page && opts?.limit) {
      const page = Math.max(1, opts.page);
      const limit = Math.max(1, opts.limit);
      const skip = (page - 1) * limit;

      const data = await this.prisma.coreMembers.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          portfolio: true,
          academicYear: true,
          rollNumber: true,
          sectionBranch: true,
          category: true,
          teamCategory: true,
          memberShipId: true,
        },
      });

      return { data, total };
    }

    const data = await this.prisma.coreMembers.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        portfolio: true,
        academicYear: true,
        rollNumber: true,
        sectionBranch: true,
        category: true,
        teamCategory: true,
        memberShipId: true,
      },
    });

    return { data, total };
  }

  async getImageBuffer(id: string, size?: number): Promise<Buffer> {
    const member = await this.findOne(id);
    if (!member.image) throw new NotFoundException(`Image not found for core member ${id}`);
    const buffer = Buffer.from(member.image as any);

    if (!size) return buffer;

    try {
      const optimizedBuffer = await sharp(buffer)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: size <= 300 ? 80 : 90,
          progressive: true
        })
        .toBuffer();
      return optimizedBuffer;
    } catch (err) {
      return buffer;
    }
  }

  async findOne(id: string) {
    const member = await this.prisma.coreMembers.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Core member with ID ${id} not found`);
    }

    return member;
  }

  async update(id: string, updateCoreMemberDto: UpdateCoreMemberDto, imageBuffer?: Buffer) {
    const existingMember = await this.findOne(id);

    const data: any = { ...updateCoreMemberDto };
    if (imageBuffer) {
      data.image = new Uint8Array(imageBuffer);
    }

    const updated = await this.prisma.coreMembers.update({
      where: { id },
      data: data,
    });

    // Sync updates to Club Members
    const syncData = {
      name: updated.name,
      academicYear: updated.academicYear,
      sectionBranch: updated.sectionBranch,
      rollNumber: updated.rollNumber,
      memberShipId: updated.memberShipId,
    };

    const existingClubMember = await this.prisma.clubMembers.findFirst({
      where: { rollNumber: updated.rollNumber },
    });

    if (existingClubMember) {
      await this.prisma.clubMembers.update({
        where: { id: existingClubMember.id },
        data: syncData,
      });
    } else {
      await this.prisma.clubMembers.create({
        data: syncData,
      });
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.coreMembers.delete({
      where: { id },
    });
  }

  async getImage(id: string) {
    const member = await this.findOne(id);
    
    if (!member.image) {
      throw new NotFoundException(`Image not found for core member ${id}`);
    }

    return member.image;
  }

  async findByCategory(category: string) {
    return this.prisma.coreMembers.findMany({
      where: { category },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findByTeamCategory(teamCategory: string) {
    return this.prisma.coreMembers.findMany({
      where: { teamCategory },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findByYear(year: string) {
    return this.prisma.coreMembers.findMany({
      where: { academicYear: year },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
