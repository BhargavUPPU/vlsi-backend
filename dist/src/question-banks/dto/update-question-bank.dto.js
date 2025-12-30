"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQuestionBankDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_question_bank_dto_1 = require("./create-question-bank.dto");
class UpdateQuestionBankDto extends (0, mapped_types_1.PartialType)(create_question_bank_dto_1.CreateQuestionBankDto) {
}
exports.UpdateQuestionBankDto = UpdateQuestionBankDto;
//# sourceMappingURL=update-question-bank.dto.js.map