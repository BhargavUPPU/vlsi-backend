import { PrismaService } from '../prisma/prisma.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProjectDto: any, files?: Array<Express.Multer.File>): Promise<({
        images: {
            id: number;
            projectId: number;
            fileData: Prisma.Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: Prisma.JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: Prisma.JsonValue | null;
        Tools: Prisma.JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findAll(filters?: {
        status?: string;
        category?: string;
        academicYear?: string;
    }): Promise<({
        images: {
            id: number;
            projectId: number;
            fileData: Prisma.Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: Prisma.JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: Prisma.JsonValue | null;
        Tools: Prisma.JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        images: {
            id: number;
            projectId: number;
            fileData: Prisma.Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: Prisma.JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: Prisma.JsonValue | null;
        Tools: Prisma.JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<{
        images: {
            id: number;
            projectId: number;
            fileData: Prisma.Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: Prisma.JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: Prisma.JsonValue | null;
        Tools: Prisma.JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: Prisma.JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: Prisma.JsonValue | null;
        Tools: Prisma.JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addImage(projectId: number, imageBuffer: Buffer): Promise<{
        id: number;
        projectId: number;
        fileData: Prisma.Bytes;
    }>;
    getImage(imageId: number): Promise<{
        id: number;
        projectId: number;
        fileData: Prisma.Bytes;
    }>;
    removeImage(imageId: number): Promise<{
        id: number;
        projectId: number;
        fileData: Prisma.Bytes;
    }>;
    getProjectsByYear(year: string): Promise<({
        images: {
            id: number;
            projectId: number;
            fileData: Prisma.Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: Prisma.JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: Prisma.JsonValue | null;
        Tools: Prisma.JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getProjectsByCategory(category: string): Promise<({
        images: {
            id: number;
            projectId: number;
            fileData: Prisma.Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: Prisma.JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: Prisma.JsonValue | null;
        Tools: Prisma.JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
