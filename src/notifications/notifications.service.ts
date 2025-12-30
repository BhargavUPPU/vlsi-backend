import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  create(createNotificationDto: CreateNotificationDto) {
    console.log("createNotificationDto", createNotificationDto);
    return this.prisma.runningNotifications.create({ data: createNotificationDto });
  }

  findAll() {
    return this.prisma.runningNotifications.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  findActive() {
    return this.prisma.runningNotifications.findMany({
      orderBy: [ { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException(`Notification with ID ${id} not found`);
    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.findOne(id);
    return this.prisma.notification.update({ where: { id }, data: updateNotificationDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.notification.delete({ where: { id } });
  }
}
