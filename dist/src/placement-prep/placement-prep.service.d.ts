import { PrismaService } from '../prisma/prisma.service';
export declare class PlacementPrepService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        link: string;
    }, imageBuffer?: Buffer): import(".prisma/client").Prisma.Prisma__placementPrepClient<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
    }>;
    update(id: string, data: any, imageBuffer?: Buffer): Promise<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        image: import("@prisma/client/runtime/library").Bytes | null;
    }>;
    getImage(id: string): Promise<Uint8Array<ArrayBuffer>>;
}
