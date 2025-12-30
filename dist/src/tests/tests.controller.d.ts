import { TestsService } from './tests.service';
import { CreateTestDto, UpdateTestDto } from './dto/test.dto';
export declare class TestsController {
    private readonly testsService;
    constructor(testsService: TestsService);
    create(createTestDto: CreateTestDto): import(".prisma/client").Prisma.Prisma__TestClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: string;
        description: string | null;
        subject: string;
        type: string;
        noOfQuestions: number;
        duration: number;
        examLink: string;
        date: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(status?: string, subject?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: string;
        description: string | null;
        subject: string;
        type: string;
        noOfQuestions: number;
        duration: number;
        examLink: string;
        date: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: string;
        description: string | null;
        subject: string;
        type: string;
        noOfQuestions: number;
        duration: number;
        examLink: string;
        date: Date;
    }>;
    update(id: string, updateTestDto: UpdateTestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: string;
        description: string | null;
        subject: string;
        type: string;
        noOfQuestions: number;
        duration: number;
        examLink: string;
        date: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: string;
        description: string | null;
        subject: string;
        type: string;
        noOfQuestions: number;
        duration: number;
        examLink: string;
        date: Date;
    }>;
}
