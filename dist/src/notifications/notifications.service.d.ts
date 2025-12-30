import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createNotificationDto: CreateNotificationDto): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        link: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        message: string;
        isActive: boolean;
        priority: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        link: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        message: string;
        isActive: boolean;
        priority: number;
    }[]>;
    findActive(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        link: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        message: string;
        isActive: boolean;
        priority: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        link: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        message: string;
        isActive: boolean;
        priority: number;
    }>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<{
        id: string;
        link: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        message: string;
        isActive: boolean;
        priority: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        link: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        message: string;
        isActive: boolean;
        priority: number;
    }>;
}
