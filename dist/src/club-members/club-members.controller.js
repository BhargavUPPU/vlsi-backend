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
exports.ClubMembersController = void 0;
const common_1 = require("@nestjs/common");
const club_members_service_1 = require("./club-members.service");
const create_club_member_dto_1 = require("./dto/create-club-member.dto");
const update_club_member_dto_1 = require("./dto/update-club-member.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ClubMembersController = class ClubMembersController {
    clubMembersService;
    constructor(clubMembersService) {
        this.clubMembersService = clubMembersService;
    }
    create(createClubMemberDto) {
        return this.clubMembersService.create(createClubMemberDto);
    }
    findAll() {
        return this.clubMembersService.findAll();
    }
    findByYear(year) {
        return this.clubMembersService.findByYear(year);
    }
    findBySection(section) {
        return this.clubMembersService.findBySection(section);
    }
    findOne(id) {
        return this.clubMembersService.findOne(id);
    }
    update(id, updateClubMemberDto) {
        return this.clubMembersService.update(id, updateClubMemberDto);
    }
    remove(id) {
        return this.clubMembersService.remove(id);
    }
};
exports.ClubMembersController = ClubMembersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_club_member_dto_1.CreateClubMemberDto]),
    __metadata("design:returntype", void 0)
], ClubMembersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClubMembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('year/:year'),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClubMembersController.prototype, "findByYear", null);
__decorate([
    (0, common_1.Get)('section/:section'),
    __param(0, (0, common_1.Param)('section')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClubMembersController.prototype, "findBySection", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClubMembersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_club_member_dto_1.UpdateClubMemberDto]),
    __metadata("design:returntype", void 0)
], ClubMembersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClubMembersController.prototype, "remove", null);
exports.ClubMembersController = ClubMembersController = __decorate([
    (0, common_1.Controller)('club-members'),
    __metadata("design:paramtypes", [club_members_service_1.ClubMembersService])
], ClubMembersController);
//# sourceMappingURL=club-members.controller.js.map