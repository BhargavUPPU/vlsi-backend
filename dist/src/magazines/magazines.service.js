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
exports.MagazinesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MagazinesService = class MagazinesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data, imageBuffer) {
        return this.prisma.magazine.create({
            data: { ...data, image: imageBuffer ? new Uint8Array(imageBuffer) : null },
        });
    }
    findAll() {
        return this.prisma.magazine.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async findOne(id) {
        const item = await this.prisma.magazine.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException(`Magazine ${id} not found`);
        return item;
    }
    async update(id, data, imageBuffer) {
        await this.findOne(id);
        const updateData = { ...data };
        if (imageBuffer)
            updateData.image = new Uint8Array(imageBuffer);
        return this.prisma.magazine.update({ where: { id }, data: updateData });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.magazine.delete({ where: { id } });
    }
    async getImage(id) {
        const item = await this.findOne(id);
        if (!item.image)
            throw new common_1.NotFoundException(`Image not found`);
        return item.image;
    }
};
exports.MagazinesService = MagazinesService;
exports.MagazinesService = MagazinesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MagazinesService);
//# sourceMappingURL=magazines.service.js.map