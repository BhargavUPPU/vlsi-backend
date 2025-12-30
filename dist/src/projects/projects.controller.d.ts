import { StreamableFile } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Response } from 'express';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: any, uploadedFiles: {
        files?: Express.Multer.File[];
    }): Promise<({
        images: {
            id: number;
            projectId: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: import("@prisma/client/runtime/library").JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: import("@prisma/client/runtime/library").JsonValue | null;
        Tools: import("@prisma/client/runtime/library").JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findAll(status?: string, category?: string, academicYear?: string): Promise<({
        images: {
            id: number;
            projectId: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: import("@prisma/client/runtime/library").JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: import("@prisma/client/runtime/library").JsonValue | null;
        Tools: import("@prisma/client/runtime/library").JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getByYear(year: string): Promise<({
        images: {
            id: number;
            projectId: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: import("@prisma/client/runtime/library").JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: import("@prisma/client/runtime/library").JsonValue | null;
        Tools: import("@prisma/client/runtime/library").JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getByCategory(category: string): Promise<({
        images: {
            id: number;
            projectId: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: import("@prisma/client/runtime/library").JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: import("@prisma/client/runtime/library").JsonValue | null;
        Tools: import("@prisma/client/runtime/library").JsonValue | null;
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
            fileData: import("@prisma/client/runtime/library").Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: import("@prisma/client/runtime/library").JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: import("@prisma/client/runtime/library").JsonValue | null;
        Tools: import("@prisma/client/runtime/library").JsonValue | null;
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
            fileData: import("@prisma/client/runtime/library").Bytes;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        Introduction: string;
        academicYear: string;
        Mentor: string;
        category: string;
        Members: import("@prisma/client/runtime/library").JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: import("@prisma/client/runtime/library").JsonValue | null;
        Tools: import("@prisma/client/runtime/library").JsonValue | null;
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
        Members: import("@prisma/client/runtime/library").JsonValue | null;
        Statement: string | null;
        Abstract: string | null;
        Conclusion: string;
        Results: string | null;
        futureScope: string | null;
        referenceLinks: import("@prisma/client/runtime/library").JsonValue | null;
        Tools: import("@prisma/client/runtime/library").JsonValue | null;
        Link: string | null;
        createdBy: string | null;
        startDate: string | null;
        endDate: string | null;
        Methodology: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadImage(id: number, file: Express.Multer.File): Promise<{
        id: number;
        projectId: number;
        fileData: import("@prisma/client/runtime/library").Bytes;
    }>;
    getImage(imageId: number, res: Response): Promise<StreamableFile>;
    removeImage(imageId: number): Promise<{
        id: number;
        projectId: number;
        fileData: import("@prisma/client/runtime/library").Bytes;
    }>;
}
