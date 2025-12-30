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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextbooksController = void 0;
const common_1 = require("@nestjs/common");
const textbooks_service_1 = require("./textbooks.service");
const textbook_dto_1 = require("./dto/textbook.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let TextbooksController = class TextbooksController {
    textbooksService;
    constructor(textbooksService) {
        this.textbooksService = textbooksService;
    }
    create(dto, file) {
        return this.textbooksService.create(dto, file?.buffer);
    }
    findAll() {
        return this.textbooksService.findAll();
    }
    findBySubject(subject) {
        return this.textbooksService.findBySubject(subject);
    }
    findOne(id) {
        return this.textbooksService.findOne(id);
    }
    async getImage(id, res) {
        const image = await this.textbooksService.getImage(id);
        res.set({ 'Content-Type': 'image/jpeg', 'Content-Disposition': 'inline' });
        return new common_1.StreamableFile(Buffer.from(image));
    }
    update(id, dto, file) {
        return this.textbooksService.update(id, dto, file?.buffer);
    }
    remove(id) {
        return this.textbooksService.remove(id);
    }
};
exports.TextbooksController = TextbooksController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [textbook_dto_1.CreateTextbookDto, Object]),
    __metadata("design:returntype", void 0)
], TextbooksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TextbooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('subject/:subject'),
    __param(0, (0, common_1.Param)('subject')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextbooksController.prototype, "findBySubject", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextbooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TextbooksController.prototype, "getImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, textbook_dto_1.UpdateTextbookDto, Object]),
    __metadata("design:returntype", void 0)
], TextbooksController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextbooksController.prototype, "remove", null);
exports.TextbooksController = TextbooksController = __decorate([
    (0, common_1.Controller)('textbooks'),
    __metadata("design:paramtypes", [textbooks_service_1.TextbooksService])
], TextbooksController);
//# sourceMappingURL=textbooks.controller.js.map