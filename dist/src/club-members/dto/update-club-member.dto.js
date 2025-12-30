"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClubMemberDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_club_member_dto_1 = require("./create-club-member.dto");
class UpdateClubMemberDto extends (0, mapped_types_1.PartialType)(create_club_member_dto_1.CreateClubMemberDto) {
}
exports.UpdateClubMemberDto = UpdateClubMemberDto;
//# sourceMappingURL=update-club-member.dto.js.map