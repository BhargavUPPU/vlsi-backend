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
exports.CoreMembersController = void 0;
const common_1 = require("@nestjs/common");
const core_members_service_1 = require("./core-members.service");
const create_core_member_dto_1 = require("./dto/create-core-member.dto");
const update_core_member_dto_1 = require("./dto/update-core-member.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let CoreMembersController = class CoreMembersController {
    coreMembersService;
    constructor(coreMembersService) {
        this.coreMembersService = coreMembersService;
    }
    create(createCoreMemberDto, file) {
        return this.coreMembersService.create(createCoreMemberDto, file?.buffer);
    }
    findAll() {
        return this.coreMembersService.findAll();
    }
    findByCategory(category) {
        return this.coreMembersService.findByCategory(category);
    }
    findByTeamCategory(teamCategory) {
        return this.coreMembersService.findByTeamCategory(teamCategory);
    }
    findByYear(year) {
        return this.coreMembersService.findByYear(year);
    }
    findOne(id) {
        return this.coreMembersService.findOne(id);
    }
    async getImage(id, res) {
        const image = await this.coreMembersService.getImage(id);
        res.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': 'inline',
        });
        return new common_1.StreamableFile(Buffer.from(image));
    }
    update(id, updateCoreMemberDto, file) {
        return this.coreMembersService.update(id, updateCoreMemberDto, file?.buffer);
    }
    remove(id) {
        return this.coreMembersService.remove(id);
    }
};
exports.CoreMembersController = CoreMembersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_core_member_dto_1.CreateCoreMemberDto, Object]),
    __metadata("design:returntype", void 0)
], CoreMembersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoreMembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoreMembersController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('team/:teamCategory'),
    __param(0, (0, common_1.Param)('teamCategory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoreMembersController.prototype, "findByTeamCategory", null);
__decorate([
    (0, common_1.Get)('year/:year'),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoreMembersController.prototype, "findByYear", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoreMembersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CoreMembersController.prototype, "getImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_core_member_dto_1.UpdateCoreMemberDto, Object]),
    __metadata("design:returntype", void 0)
], CoreMembersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoreMembersController.prototype, "remove", null);
exports.CoreMembersController = CoreMembersController = __decorate([
    (0, common_1.Controller)('core-members'),
    __metadata("design:paramtypes", [core_members_service_1.CoreMembersService])
], CoreMembersController);
//# sourceMappingURL=core-members.controller.js.map