import { StreamableFile } from '@nestjs/common';
import { PlacementPrepService } from './placement-prep.service';
import { Response } from 'express';
export declare class PlacementPrepController {
    private readonly placementPrepService;
    constructor(placementPrepService: PlacementPrepService);
    create(createDto: any, image?: Express.Multer.File): import(".prisma/client").Prisma.Prisma__placementPrepClient<{
        id: string;
        name: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: any, image?: Express.Multer.File): Promise<{
        id: string;
        name: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        image: import("@prisma/client/runtime/library").Bytes | null;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getImage(id: string, res: Response): Promise<StreamableFile>;
}
