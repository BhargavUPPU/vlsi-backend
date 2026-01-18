import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async create(createMilestoneDto: CreateMilestoneDto, imageFile?: Express.Multer.File) {
    const data: any = {
      ...createMilestoneDto,
      date: new Date(createMilestoneDto.date),
    };

    // Add image if provided
    if (imageFile) {
      data.image = new Uint8Array(imageFile.buffer);
    }

    return this.prisma.milestone.create({ data });
  }

  async findAll(filters?: { year?: number; category?: string; isActive?: boolean }) {
    const where: any = {};

    // Filter by active status (default to true for public view)
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    } else {
      where.isActive = true; // By default, show only active milestones
    }

    // Filter by year
    if (filters?.year) {
      const yearStart = new Date(filters.year, 0, 1);
      const yearEnd = new Date(filters.year, 11, 31, 23, 59, 59);
      where.date = {
        gte: yearStart,
        lte: yearEnd,
      };
    }

    // Filter by category
    if (filters?.category) {
      where.category = filters.category;
    }

    return this.prisma.milestone.findMany({
      where,
      orderBy: [
        { priority: 'desc' }, // Higher priority first
        { date: 'desc' },     // Then by date descending
      ],
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        icon: true,
        color: true,
        bgColor: true,
        category: true,
        priority: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Exclude image blob from list view for performance
      },
    });
  }

  async findOne(id: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    return milestone;
  }

  async update(id: string, updateMilestoneDto: UpdateMilestoneDto, imageFile?: Express.Multer.File) {
    await this.findOne(id); // Ensure milestone exists

    const data: any = { ...updateMilestoneDto };

    // Update date if provided
    if (updateMilestoneDto.date) {
      data.date = new Date(updateMilestoneDto.date);
    }

    // Add or update image if provided
    if (imageFile) {
      data.image = new Uint8Array(imageFile.buffer);
    }

    return this.prisma.milestone.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure milestone exists

    // Soft delete by setting isActive to false
    return this.prisma.milestone.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async hardDelete(id: string) {
    await this.findOne(id); // Ensure milestone exists

    return this.prisma.milestone.delete({
      where: { id },
    });
  }

  async getImage(id: string) {
    const milestone = await this.findOne(id);

    if (!milestone.image) {
      throw new NotFoundException(`Image not found for milestone ${id}`);
    }

    return milestone.image;
  }

  async updatePriority(id: string, priority: number) {
    await this.findOne(id);

    return this.prisma.milestone.update({
      where: { id },
      data: { priority },
    });
  }

  async toggleActive(id: string) {
    const milestone = await this.findOne(id);

    return this.prisma.milestone.update({
      where: { id },
      data: { isActive: !milestone.isActive },
    });
  }

  // Get unique years for filtering
  async getAvailableYears(): Promise<number[]> {
    const milestones = await this.prisma.milestone.findMany({
      where: { isActive: true },
      select: { date: true },
      orderBy: { date: 'desc' },
    });

    const years = [...new Set(milestones.map(m => m.date.getFullYear()))];
    return years.sort((a, b) => b - a); // Descending order
  }

  // Get unique categories for filtering
  async getAvailableCategories(): Promise<string[]> {
    const milestones = await this.prisma.milestone.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return milestones
      .map(m => m.category)
      .filter((category): category is string => category !== null);
  }
}
