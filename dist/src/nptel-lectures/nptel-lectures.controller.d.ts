import { StreamableFile } from '@nestjs/common';
import { NptelLecturesService } from './nptel-lectures.service';
import { Response } from 'express';
export declare class NptelLecturesController {
    private readonly service;
    constructor(service: NptelLecturesService);
    create(data: any, file?: Express.Multer.File): import(".prisma/client").Prisma.Prisma__nptelLectureClient<{
        id: string;
        courseName: string;
        professorName: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        courseName: string;
        professorName: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        courseName: string;
        professorName: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getImage(id: string, res: Response): Promise<StreamableFile>;
    update(id: string, data: any, file?: Express.Multer.File): Promise<{
        id: string;
        courseName: string;
        professorName: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        courseName: string;
        professorName: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
