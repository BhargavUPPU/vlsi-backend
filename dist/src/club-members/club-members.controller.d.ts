import { ClubMembersService } from './club-members.service';
import { CreateClubMemberDto } from './dto/create-club-member.dto';
import { UpdateClubMemberDto } from './dto/update-club-member.dto';
export declare class ClubMembersController {
    private readonly clubMembersService;
    constructor(clubMembersService: ClubMembersService);
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
            imageUrl: import("@prisma/client/runtime/library").Bytes;
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
            imageUrl: import("@prisma/client/runtime/library").Bytes;
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
            imageUrl: import("@prisma/client/runtime/library").Bytes;
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
            imageUrl: import("@prisma/client/runtime/library").Bytes;
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
            imageUrl: import("@prisma/client/runtime/library").Bytes;
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
            imageUrl: import("@prisma/client/runtime/library").Bytes;
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
}
