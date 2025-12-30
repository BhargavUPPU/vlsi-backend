import { PrismaService } from '../prisma/prisma.service';
import { CreateCoreMemberDto } from './dto/create-core-member.dto';
import { UpdateCoreMemberDto } from './dto/update-core-member.dto';
import { Prisma } from '@prisma/client';
export declare class CoreMembersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCoreMemberDto: CreateCoreMemberDto, imageBuffer?: Buffer): Promise<{
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
        imageUrl: Prisma.Bytes;
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
        imageUrl: Prisma.Bytes;
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
        imageUrl: Prisma.Bytes;
    }>;
    update(id: string, updateCoreMemberDto: UpdateCoreMemberDto, imageBuffer?: Buffer): Promise<{
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
        imageUrl: Prisma.Bytes;
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
        imageUrl: Prisma.Bytes;
    }>;
    getImage(id: string): Promise<Uint8Array<ArrayBuffer>>;
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
        imageUrl: Prisma.Bytes;
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
        imageUrl: Prisma.Bytes;
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
        imageUrl: Prisma.Bytes;
    })[]>;
}
