import { PartialType } from '@nestjs/mapped-types';
import { CreateCoreMemberDto } from './create-core-member.dto';

export class UpdateCoreMemberDto extends PartialType(CreateCoreMemberDto) {}
