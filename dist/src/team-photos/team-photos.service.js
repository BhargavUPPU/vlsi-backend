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
exports.TeamPhotosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeamPhotosService = class TeamPhotosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(academicYear, imageBuffer) {
        return this.prisma.teamPhoto.create({
            data: {
                academicYear,
                imageData: new Uint8Array(imageBuffer),
            },
        });
    }
    findAll() {
        return this.prisma.teamPhoto.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async findOne(id) {
        const photo = await this.prisma.teamPhoto.findUnique({ where: { id } });
        if (!photo)
            throw new common_1.NotFoundException(`Team Photo ${id} not found`);
        return photo;
    }
    async findByYear(year) {
        const photo = await this.prisma.teamPhoto.findUnique({
            where: { academicYear: year },
        });
        if (!photo)
            throw new common_1.NotFoundException(`Team Photo for year ${year} not found`);
        return photo;
    }
    async update(id, imageBuffer) {
        await this.findOne(id);
        return this.prisma.teamPhoto.update({
            where: { id },
            data: { imageData: new Uint8Array(imageBuffer) },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.teamPhoto.delete({ where: { id } });
    }
    async getImage(id) {
        const photo = await this.findOne(id);
        return photo.imageData;
    }
};
exports.TeamPhotosService = TeamPhotosService;
exports.TeamPhotosService = TeamPhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamPhotosService);
//# sourceMappingURL=team-photos.service.js.map