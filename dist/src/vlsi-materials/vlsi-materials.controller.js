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
exports.VlsiMaterialsController = void 0;
const common_1 = require("@nestjs/common");
const vlsi_materials_service_1 = require("./vlsi-materials.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let VlsiMaterialsController = class VlsiMaterialsController {
    vlsiMaterialsService;
    constructor(vlsiMaterialsService) {
        this.vlsiMaterialsService = vlsiMaterialsService;
    }
    create(createDto, image) {
        console.log('Creating VLSI Material with data:', createDto);
        console.log('Image received:', image ? `Yes (${image.size} bytes)` : 'No');
        return this.vlsiMaterialsService.create(createDto, image?.buffer);
    }
    findAll(category) {
        if (category) {
            return this.vlsiMaterialsService.findByCategory(category);
        }
        return this.vlsiMaterialsService.findAll();
    }
    findOne(id) {
        return this.vlsiMaterialsService.findOne(id);
    }
    update(id, updateDto, image) {
        console.log('Updating VLSI Material:', id);
        return this.vlsiMaterialsService.update(id, updateDto, image?.buffer);
    }
    remove(id) {
        return this.vlsiMaterialsService.remove(id);
    }
    async getImage(id, res) {
        const image = await this.vlsiMaterialsService.getImage(id);
        res.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': 'inline',
        });
        return new common_1.StreamableFile(Buffer.from(image));
    }
};
exports.VlsiMaterialsController = VlsiMaterialsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VlsiMaterialsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VlsiMaterialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VlsiMaterialsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], VlsiMaterialsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VlsiMaterialsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VlsiMaterialsController.prototype, "getImage", null);
exports.VlsiMaterialsController = VlsiMaterialsController = __decorate([
    (0, common_1.Controller)('vlsiMaterials'),
    __metadata("design:paramtypes", [vlsi_materials_service_1.VlsiMaterialsService])
], VlsiMaterialsController);
//# sourceMappingURL=vlsi-materials.controller.js.map