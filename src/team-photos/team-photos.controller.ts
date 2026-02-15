import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TeamPhotosService } from './team-photos.service';
import { CreateTeamPhotoDto } from './dto/create-team-photo.dto';
import { UpdateTeamPhotoDto } from './dto/update-team-photo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';

@Controller('teamPhotos')
export class TeamPhotosController {
  constructor(private readonly teamPhotosService: TeamPhotosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createTeamPhotoDto: CreateTeamPhotoDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0)
      throw new Error('At least one image file is required');
    return this.teamPhotosService.create(
      createTeamPhotoDto.academicYear,
      files.map((f) => f.buffer),
    );
  }

  @Get()
  findAll() {
    return this.teamPhotosService.findAll();
  }

  @Get('year/:year')
  findByYear(@Param('year') year: string) {
    return this.teamPhotosService.findByYear(year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamPhotosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  update(
    @Param('id') id: string,
    @Body() updateTeamPhotoDto: UpdateTeamPhotoDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const buffers: Buffer[] = files && files.length ? files.map((f) => f.buffer) : [];
    return this.teamPhotosService.update(id, updateTeamPhotoDto, buffers);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamPhotosService.remove(id);
  }

  @Get(':id/images')
  async getImages(@Param('id') id: string) {
    const imagesData = await this.teamPhotosService.getImages(id);
    return imagesData.map((data) => Buffer.from(data));
  }
}
