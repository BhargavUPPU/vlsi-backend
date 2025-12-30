import { PrismaService } from '../prisma/prisma.service';
export declare class GatePyqsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        year: number;
        link: string;
        name: string;
    }): import(".prisma/client").Prisma.Prisma__gatePyqsClient<{
        id: string;
        name: string;
        year: number;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        year: number;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        year: number;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        year: number;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        year: number;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByYear(year: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        year: number;
        link: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
