import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from './announcement.dto';

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
