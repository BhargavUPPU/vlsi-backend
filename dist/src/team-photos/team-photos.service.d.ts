import { PrismaService } from '../prisma/prisma.service';
export declare class TeamPhotosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(academicYear: string, imageBuffer: Buffer): Promise<{
        id: string;
        academicYear: string;
        createdAt: Date;
        updatedAt: Date;
        imageData: import("@prisma/client/runtime/library").Bytes;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        academicYear: string;
        createdAt: Date;
        updatedAt: Date;
        imageData: import("@prisma/client/runtime/library").Bytes;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        academicYear: string;
        createdAt: Date;
        updatedAt: Date;
        imageData: import("@prisma/client/runtime/library").Bytes;
    }>;
    findByYear(year: string): Promise<{
        id: string;
        academicYear: string;
        createdAt: Date;
        updatedAt: Date;
        imageData: import("@prisma/client/runtime/library").Bytes;
    }>;
    update(id: string, imageBuffer: Buffer): Promise<{
        id: string;
        academicYear: string;
        createdAt: Date;
        updatedAt: Date;
        imageData: import("@prisma/client/runtime/library").Bytes;
    }>;
    remove(id: string): Promise<{
        id: string;
        academicYear: string;
        createdAt: Date;
        updatedAt: Date;
        imageData: import("@prisma/client/runtime/library").Bytes;
    }>;
    getImage(id: string): Promise<Uint8Array<ArrayBuffer>>;
}
