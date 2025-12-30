import { StreamableFile } from '@nestjs/common';
import { TextbooksService } from './textbooks.service';
import { CreateTextbookDto, UpdateTextbookDto } from './dto/textbook.dto';
import { Response } from 'express';
export declare class TextbooksController {
    private readonly textbooksService;
    constructor(textbooksService: TextbooksService);
    create(dto: CreateTextbookDto, file?: Express.Multer.File): import(".prisma/client").Prisma.Prisma__TextBookClient<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        description: string;
        subject: string;
        author: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        description: string;
        subject: string;
        author: string;
    }[]>;
    findBySubject(subject: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        description: string;
        subject: string;
        author: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        description: string;
        subject: string;
        author: string;
    }>;
    getImage(id: string, res: Response): Promise<StreamableFile>;
    update(id: string, dto: UpdateTextbookDto, file?: Express.Multer.File): Promise<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        description: string;
        subject: string;
        author: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        description: string;
        subject: string;
        author: string;
    }>;
}
