import { StreamableFile } from '@nestjs/common';
import { MagazinesService } from './magazines.service';
import { Response } from 'express';
export declare class MagazinesController {
    private readonly magazinesService;
    constructor(magazinesService: MagazinesService);
    create(createDto: any, image?: Express.Multer.File): import(".prisma/client").Prisma.Prisma__magazineClient<{
        id: string;
        title: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        title: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: any, image?: Express.Multer.File): Promise<{
        id: string;
        title: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getImage(id: string, res: Response): Promise<StreamableFile>;
}
