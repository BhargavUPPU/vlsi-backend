import { PrismaService } from '../prisma/prisma.service';
import { CreateClubMemberDto } from './dto/create-club-member.dto';
import { UpdateClubMemberDto } from './dto/update-club-member.dto';
import { Prisma } from '@prisma/client';
export declare class ClubMembersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createClubMemberDto: CreateClubMemberDto): Promise<{
        coreMember: {
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
        } | null;
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        coreMemberId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        coreMember: {
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
        } | null;
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        coreMemberId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        coreMember: {
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
        } | null;
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        coreMemberId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateClubMemberDto: UpdateClubMemberDto): Promise<{
        coreMember: {
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
        } | null;
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        coreMemberId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        coreMemberId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByYear(year: string): Promise<({
        coreMember: {
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
        } | null;
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        coreMemberId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findBySection(section: string): Promise<({
        coreMember: {
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
        } | null;
    } & {
        id: string;
        name: string;
        academicYear: string;
        sectionBranch: string;
        rollNumber: string;
        memberShipId: string | null;
        coreMemberId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
