import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 15 },
  ]))
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  // Image endpoints
  @UseGuards(JwtAuthGuard)
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.addImage(id, file.buffer);
  }

  @Get('images/:imageId')
  async getImage(
    @Param('imageId', ParseIntPipe) imageId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const image = await this.projectsService.getImage(imageId);
    res.set({
      'Content-Type': 'image/jpeg', // Adjust based on your needs
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(Buffer.from(image.fileData));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('images/:imageId')
  removeImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.projectsService.removeImage(imageId);
  }
}
