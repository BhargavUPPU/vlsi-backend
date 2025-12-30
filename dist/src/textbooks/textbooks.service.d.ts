import { PrismaService } from '../prisma/prisma.service';
import { CreateTextbookDto, UpdateTextbookDto } from './dto/textbook.dto';
export declare class TextbooksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTextbookDto: CreateTextbookDto, imageBuffer?: Buffer): import(".prisma/client").Prisma.Prisma__TextBookClient<{
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
    update(id: string, updateTextbookDto: UpdateTextbookDto, imageBuffer?: Buffer): Promise<{
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
    getImage(id: string): Promise<Uint8Array<ArrayBuffer>>;
}
