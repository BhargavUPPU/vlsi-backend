"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCoreMemberDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_core_member_dto_1 = require("./create-core-member.dto");
class UpdateCoreMemberDto extends (0, mapped_types_1.PartialType)(create_core_member_dto_1.CreateCoreMemberDto) {
}
exports.UpdateCoreMemberDto = UpdateCoreMemberDto;
//# sourceMappingURL=update-core-member.dto.js.map