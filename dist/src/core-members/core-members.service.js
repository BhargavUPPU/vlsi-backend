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
exports.CoreMembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CoreMembersService = class CoreMembersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCoreMemberDto, imageBuffer) {
        const data = { ...createCoreMemberDto };
        if (imageBuffer) {
            data.imageUrl = new Uint8Array(imageBuffer);
        }
        return this.prisma.coreMembers.create({
            data: data,
            include: {
                clubMember: true,
            },
        });
    }
    async findAll() {
        return this.prisma.coreMembers.findMany({
            include: {
                clubMember: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const member = await this.prisma.coreMembers.findUnique({
            where: { id },
            include: {
                clubMember: true,
            },
        });
        if (!member) {
            throw new common_1.NotFoundException(`Core member with ID ${id} not found`);
        }
        return member;
    }
    async update(id, updateCoreMemberDto, imageBuffer) {
        await this.findOne(id);
        const data = { ...updateCoreMemberDto };
        if (imageBuffer) {
            data.imageUrl = new Uint8Array(imageBuffer);
        }
        return this.prisma.coreMembers.update({
            where: { id },
            data: data,
            include: {
                clubMember: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.coreMembers.delete({
            where: { id },
        });
    }
    async getImage(id) {
        const member = await this.findOne(id);
        if (!member.imageUrl) {
            throw new common_1.NotFoundException(`Image not found for core member ${id}`);
        }
        return member.imageUrl;
    }
    async findByCategory(category) {
        return this.prisma.coreMembers.findMany({
            where: { category },
            include: {
                clubMember: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findByTeamCategory(teamCategory) {
        return this.prisma.coreMembers.findMany({
            where: { teamCategory },
            include: {
                clubMember: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findByYear(year) {
        return this.prisma.coreMembers.findMany({
            where: { academicYear: year },
            include: {
                clubMember: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
};
exports.CoreMembersService = CoreMembersService;
exports.CoreMembersService = CoreMembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoreMembersService);
//# sourceMappingURL=core-members.service.js.map