import { StreamableFile } from '@nestjs/common';
import { VlsiMaterialsService } from './vlsi-materials.service';
import { Response } from 'express';
export declare class VlsiMaterialsController {
    private readonly vlsiMaterialsService;
    constructor(vlsiMaterialsService: VlsiMaterialsService);
    create(createDto: any, image?: Express.Multer.File): import(".prisma/client").Prisma.Prisma__vlsiMaterialClient<{
        id: string;
        name: string;
        category: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(category?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        category: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        category: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: any, image?: Express.Multer.File): Promise<{
        id: string;
        name: string;
        category: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        category: string;
        link: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getImage(id: string, res: Response): Promise<StreamableFile>;
}
