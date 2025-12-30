import { QuestionBanksService } from './question-banks.service';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';
export declare class QuestionBanksController {
    private readonly questionBanksService;
    constructor(questionBanksService: QuestionBanksService);
    create(createQuestionBankDto: CreateQuestionBankDto): import(".prisma/client").Prisma.Prisma__QuestionBankClient<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        topicName: string;
        subject: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        topicName: string;
        subject: string;
    }[]>;
    findBySubject(subject: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        topicName: string;
        subject: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        topicName: string;
        subject: string;
    }>;
    update(id: string, updateQuestionBankDto: UpdateQuestionBankDto): Promise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        topicName: string;
        subject: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        topicName: string;
        subject: string;
    }>;
}
