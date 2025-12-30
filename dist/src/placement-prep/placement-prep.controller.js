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
exports.PlacementPrepController = void 0;
const common_1 = require("@nestjs/common");
const placement_prep_service_1 = require("./placement-prep.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let PlacementPrepController = class PlacementPrepController {
    placementPrepService;
    constructor(placementPrepService) {
        this.placementPrepService = placementPrepService;
    }
    create(createDto, image) {
        console.log('Creating Placement Prep with data:', createDto);
        console.log('Image received:', image ? `Yes (${image.size} bytes)` : 'No');
        return this.placementPrepService.create(createDto, image?.buffer);
    }
    findAll() {
        return this.placementPrepService.findAll();
    }
    findOne(id) {
        return this.placementPrepService.findOne(id);
    }
    update(id, updateDto, image) {
        console.log('Updating Placement Prep:', id);
        return this.placementPrepService.update(id, updateDto, image?.buffer);
    }
    remove(id) {
        return this.placementPrepService.remove(id);
    }
    async getImage(id, res) {
        const image = await this.placementPrepService.getImage(id);
        res.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': 'inline',
        });
        return new common_1.StreamableFile(Buffer.from(image));
    }
};
exports.PlacementPrepController = PlacementPrepController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PlacementPrepController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlacementPrepController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlacementPrepController.prototype, "findOne", null);
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
], PlacementPrepController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlacementPrepController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlacementPrepController.prototype, "getImage", null);
exports.PlacementPrepController = PlacementPrepController = __decorate([
    (0, common_1.Controller)('placementPrep'),
    __metadata("design:paramtypes", [placement_prep_service_1.PlacementPrepService])
], PlacementPrepController);
//# sourceMappingURL=placement-prep.controller.js.map