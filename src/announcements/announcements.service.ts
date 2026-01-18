import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  create(createAnnouncementDto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: createAnnouncementDto,
    });
  }

  findAll() {
    return this.prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findActive() {
    return this.prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' },
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }
    return announcement;
  }

  async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto) {
    await this.findOne(id);
    return this.prisma.announcement.update({
      where: { id },
      data: updateAnnouncementDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
