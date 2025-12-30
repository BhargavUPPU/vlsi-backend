"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacementPrepModule = void 0;
const common_1 = require("@nestjs/common");
const placement_prep_controller_1 = require("./placement-prep.controller");
const placement_prep_service_1 = require("./placement-prep.service");
let PlacementPrepModule = class PlacementPrepModule {
};
exports.PlacementPrepModule = PlacementPrepModule;
exports.PlacementPrepModule = PlacementPrepModule = __decorate([
    (0, common_1.Module)({
        controllers: [placement_prep_controller_1.PlacementPrepController],
        providers: [placement_prep_service_1.PlacementPrepService]
    })
], PlacementPrepModule);
//# sourceMappingURL=placement-prep.module.js.map