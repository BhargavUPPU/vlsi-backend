import { PartialType } from '@nestjs/mapped-types';
import { CreateGatePyqDto } from './create-gate-pyq.dto';

export class UpdateGatePyqDto extends PartialType(CreateGatePyqDto) {}
