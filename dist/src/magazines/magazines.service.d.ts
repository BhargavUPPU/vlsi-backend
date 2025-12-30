import { PrismaService } from '../prisma/prisma.service';
export declare class MagazinesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        title: string;
        link: string;
    }, imageBuffer?: Buffer): import(".prisma/client").Prisma.Prisma__magazineClient<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        title: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        title: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        title: string;
    }>;
    update(id: string, data: any, imageBuffer?: Buffer): Promise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        title: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
        title: string;
    }>;
    getImage(id: string): Promise<Uint8Array<ArrayBuffer>>;
}
