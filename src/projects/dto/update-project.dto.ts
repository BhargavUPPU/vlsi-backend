import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsEmpty, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  // include the same prohibition in the update DTO as well
  @IsOptional()
  @IsEmpty({ message: 'images must not be provided; use /projects/:id/images' })
  images?: any;
}
