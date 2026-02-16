import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 15 }], { limits: { fieldSize: 20 * 1024 * 1024 } }),
  )
  create(
    @Body() createProjectDto: any,
    @UploadedFiles() uploadedFiles: { files?: Express.Multer.File[] },
  ) {
    console.log('Received project with files:', uploadedFiles);
    const files = uploadedFiles?.files || [];
    return this.projectsService.create(createProjectDto, files);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.projectsService.findAll({ status, category, academicYear });
  }

  @Get('year/:year')
  getByYear(@Param('year') year: string) {
    return this.projectsService.getProjectsByYear(year);
  }

  @Get('category/:category')
  getByCategory(@Param('category') category: string) {
    return this.projectsService.getProjectsByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 15 }], { limits: { fieldSize: 20 * 1024 * 1024 } }),
  )
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: any,
    @UploadedFiles() uploadedFiles: { files?: Express.Multer.File[] },
  ) {
    console.log('update() called for project', id, 'with payload', updateProjectDto);

    // make a shallow copy so we can safely delete unwanted props
    const body: any = { ...updateProjectDto };
    if ('images' in body) {
      console.warn('client attempted to send `images` in update payload, stripping it');
      delete body.images;
    }
    if ('include' in body) {
      console.warn('client attempted to send `include` in update payload, stripping it');
      delete body.include;
    }

    const files = uploadedFiles?.files || [];
    if (files.length) {
      console.log('  received', files.length, 'files during update');
    }
    return this.projectsService.update(id, body, files);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // Image endpoints
  @UseGuards(JwtAuthGuard)
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', { limits: { fieldSize: 20 * 1024 * 1024 } }))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.addImage(id, file.buffer);
  }

  @Get('images/:imageId')
  async getImage(
    @Param('imageId') imageId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const image = await this.projectsService.getImage(imageId);
    res.set({
      'Content-Type': 'image/jpeg', // Adjust based on your needs
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(Buffer.from(image.fileData));
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete('images/:imageId')
  removeImage(@Param('imageId') imageId: string) {
    return this.projectsService.removeImage(imageId);
  }
}
