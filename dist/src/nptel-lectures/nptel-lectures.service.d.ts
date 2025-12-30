import { PrismaService } from '../prisma/prisma.service';
export declare class NptelLecturesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        courseName: string;
        professorName: string;
        link: string;
    }, imageBuffer?: Buffer): import(".prisma/client").Prisma.Prisma__nptelLectureClient<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        courseName: string;
        professorName: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        courseName: string;
        professorName: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        courseName: string;
        professorName: string;
    }>;
    update(id: string, data: any, imageBuffer?: Buffer): Promise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        courseName: string;
        professorName: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        courseName: string;
        professorName: string;
    }>;
    getImage(id: string): Promise<Uint8Array<ArrayBuffer>>;
}
