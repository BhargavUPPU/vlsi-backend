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
exports.TextbooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TextbooksService = class TextbooksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createTextbookDto, imageBuffer) {
        return this.prisma.textBook.create({
            data: {
                ...createTextbookDto,
                image: imageBuffer ? new Uint8Array(imageBuffer) : null,
            },
        });
    }
    findAll() {
        return this.prisma.textBook.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const textbook = await this.prisma.textBook.findUnique({ where: { id } });
        if (!textbook)
            throw new common_1.NotFoundException(`Textbook with ID ${id} not found`);
        return textbook;
    }
    async update(id, updateTextbookDto, imageBuffer) {
        await this.findOne(id);
        const data = { ...updateTextbookDto };
        if (imageBuffer)
            data.image = new Uint8Array(imageBuffer);
        return this.prisma.textBook.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.textBook.delete({ where: { id } });
    }
    findBySubject(subject) {
        return this.prisma.textBook.findMany({
            where: { subject },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getImage(id) {
        const textbook = await this.findOne(id);
        if (!textbook.image)
            throw new common_1.NotFoundException(`Image not found for textbook ${id}`);
        return textbook.image;
    }
};
exports.TextbooksService = TextbooksService;
exports.TextbooksService = TextbooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TextbooksService);
//# sourceMappingURL=textbooks.service.js.map