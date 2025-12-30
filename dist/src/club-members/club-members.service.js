"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubMembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClubMembersService = class ClubMembersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createClubMemberDto) {
        return this.prisma.clubMembers.create({
            data: createClubMemberDto,
            include: {
                coreMember: true,
            },
        });
    }
    async findAll() {
        return this.prisma.clubMembers.findMany({
            include: {
                coreMember: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const member = await this.prisma.clubMembers.findUnique({
            where: { id },
            include: {
                coreMember: true,
            },
        });
        if (!member) {
            throw new common_1.NotFoundException(`Club member with ID ${id} not found`);
        }
        return member;
    }
    async update(id, updateClubMemberDto) {
        await this.findOne(id);
        return this.prisma.clubMembers.update({
            where: { id },
            data: updateClubMemberDto,
            include: {
                coreMember: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.clubMembers.delete({
            where: { id },
        });
    }
    async findByYear(year) {
        return this.prisma.clubMembers.findMany({
            where: { academicYear: year },
            include: {
                coreMember: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findBySection(section) {
        return this.prisma.clubMembers.findMany({
            where: { sectionBranch: section },
            include: {
                coreMember: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
};
exports.ClubMembersService = ClubMembersService;
exports.ClubMembersService = ClubMembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClubMembersService);
//# sourceMappingURL=club-members.service.js.map