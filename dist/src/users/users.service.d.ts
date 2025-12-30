import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        email: string | null;
        name: string | null;
        password: string | null;
        year: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    findOne(email: string): Promise<{
        id: string;
        email: string | null;
        name: string | null;
        password: string | null;
        year: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        email: string | null;
        name: string | null;
        password: string | null;
        year: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    } | null>;
    findAll(): Promise<{
        id: string;
        email: string | null;
        name: string | null;
        password: string | null;
        year: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }[]>;
}
