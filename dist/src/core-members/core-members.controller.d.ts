import { StreamableFile } from '@nestjs/common';
import { CoreMembersService } from './core-members.service';
import { CreateCoreMemberDto } from './dto/create-core-member.dto';
import { UpdateCoreMemberDto } from './dto/update-core-member.dto';
import { Response } from 'express';
export declare class CoreMembersController {
    private readonly coreMembersService;
    constructor(coreMembersService: CoreMembersService);
    create(createCoreMemberDto: CreateCoreMemberDto, file?: Express.Multer.File): Promise<{
        clubMember: {
            id: string;
            name: string;
            academicYear: string;
            sectionBranch: string;
            rollNumber: string;
            memberShipId: string | null;
            coreMemberId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        createdAt: Date;
        updatedAt: Date;
        portfolio: string;
        category: string;
        teamCategory: string | null;
        imageUrl: import("@prisma/client/runtime/library").Bytes;
    }>;
    findAll(): Promise<({
        clubMember: {
            id: string;
            name: string;
            academicYear: string;
            sectionBranch: string;
            rollNumber: string;
            memberShipId: string | null;
            coreMemberId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        createdAt: Date;
        updatedAt: Date;
        portfolio: string;
        category: string;
        teamCategory: string | null;
        imageUrl: import("@prisma/client/runtime/library").Bytes;
    })[]>;
    findByCategory(category: string): Promise<({
        clubMember: {
            id: string;
            name: string;
            academicYear: string;
            sectionBranch: string;
            rollNumber: string;
            memberShipId: string | null;
            coreMemberId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        createdAt: Date;
        updatedAt: Date;
        portfolio: string;
        category: string;
        teamCategory: string | null;
        imageUrl: import("@prisma/client/runtime/library").Bytes;
    })[]>;
    findByTeamCategory(teamCategory: string): Promise<({
        clubMember: {
            id: string;
            name: string;
            academicYear: string;
            sectionBranch: string;
            rollNumber: string;
            memberShipId: string | null;
            coreMemberId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        createdAt: Date;
        updatedAt: Date;
        portfolio: string;
        category: string;
        teamCategory: string | null;
        imageUrl: import("@prisma/client/runtime/library").Bytes;
    })[]>;
    findByYear(year: string): Promise<({
        clubMember: {
            id: string;
            name: string;
            academicYear: string;
            sectionBranch: string;
            rollNumber: string;
            memberShipId: string | null;
            coreMemberId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        createdAt: Date;
        updatedAt: Date;
        portfolio: string;
        category: string;
        teamCategory: string | null;
        imageUrl: import("@prisma/client/runtime/library").Bytes;
    })[]>;
    findOne(id: string): Promise<{
        clubMember: {
            id: string;
            name: string;
            academicYear: string;
            sectionBranch: string;
            rollNumber: string;
            memberShipId: string | null;
            coreMemberId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        createdAt: Date;
        updatedAt: Date;
        portfolio: string;
        category: string;
        teamCategory: string | null;
        imageUrl: import("@prisma/client/runtime/library").Bytes;
    }>;
    getImage(id: string, res: Response): Promise<StreamableFile>;
    update(id: string, updateCoreMemberDto: UpdateCoreMemberDto, file?: Express.Multer.File): Promise<{
        clubMember: {
            id: string;
            name: string;
            academicYear: string;
            sectionBranch: string;
            rollNumber: string;
            memberShipId: string | null;
            coreMemberId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        createdAt: Date;
        updatedAt: Date;
        portfolio: string;
        category: string;
        teamCategory: string | null;
        imageUrl: import("@prisma/client/runtime/library").Bytes;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        createdAt: Date;
        updatedAt: Date;
        portfolio: string;
        category: string;
        teamCategory: string | null;
        imageUrl: import("@prisma/client/runtime/library").Bytes;
    }>;
}
