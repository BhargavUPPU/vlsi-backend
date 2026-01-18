import { PartialType } from '@nestjs/mapped-types';
import { CreateAchievementDto } from './achievement.dto';

export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {}
