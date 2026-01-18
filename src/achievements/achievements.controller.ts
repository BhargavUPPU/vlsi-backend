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
  UseInterceptors,
  UploadedFiles,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {SuperAdminGuard} from '../auth/guards/superadmin.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 20 },
  ]))
  create(
    @Body() createAchievementDto: CreateAchievementDto,
    @UploadedFiles() uploadedFiles: { mainImage?: Express.Multer.File[], images?: Express.Multer.File[] },
  ) {
    const mainImage = uploadedFiles?.mainImage?.[0]?.buffer;
    const images = uploadedFiles?.images?.map(f => f.buffer) || [];
    return this.achievementsService.create(createAchievementDto, mainImage, images);
  }

  @Get()
  findAll(@Query('type') type?: string) {
    return this.achievementsService.findAll(type);
  }

  @Get('active')
  findActive(@Query('type') type?: string) {
    return this.achievementsService.findActive(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 20 },
  ]))
  update(
    @Param('id') id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
    @UploadedFiles() uploadedFiles: { mainImage?: Express.Multer.File[], images?: Express.Multer.File[] },
    @Body('existingImageIds') existingImageIdsString?: string,
  ) {
    const mainImage = uploadedFiles?.mainImage?.[0]?.buffer;
    const newImages = uploadedFiles?.images?.map(f => f.buffer) || [];
    
    let existingImageIds: string[] | undefined;
    if (existingImageIdsString) {
      try {
        existingImageIds = JSON.parse(existingImageIdsString);
      } catch (e) {
        existingImageIds = undefined;
      }
    }

    return this.achievementsService.update(id, updateAchievementDto, mainImage, newImages, existingImageIds);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard,SuperAdminGuard)
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(id);
  }

  @Get(':id/main-image')
  async getMainImage(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const buffer = await this.achievementsService.getMainImage(id);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(buffer);
  }

  @Get('image/:imageId')
  async getAdditionalImage(@Param('imageId') imageId: string, @Res({ passthrough: true }) res: Response) {
    const buffer = await this.achievementsService.getAdditionalImage(imageId);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(buffer);
  }
}
