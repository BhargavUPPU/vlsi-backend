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
  UseInterceptors,
  UploadedFiles,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'images', maxCount: 20 },
    ]),
  )
  create(
    @Body() createAchievementDto: CreateAchievementDto,
    @UploadedFiles()
    uploadedFiles: {
      mainImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    // Ensure boolean conversion for FormData
    const data = {
      ...createAchievementDto,
      isActive:
        createAchievementDto.isActive !== undefined
          ? createAchievementDto.isActive === true ||
            (createAchievementDto.isActive as any) === 'true'
          : true,
      priority:
        createAchievementDto.priority &&
        typeof createAchievementDto.priority === 'string'
          ? parseInt(createAchievementDto.priority, 10)
          : createAchievementDto.priority,
    };
    const mainImage = uploadedFiles?.mainImage?.[0]?.buffer;
    const images = uploadedFiles?.images?.map((f) => f.buffer) || [];
    return this.achievementsService.create(data, mainImage, images);
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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'images', maxCount: 20 },
    ]),
  )
  update(
    @Param('id') id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
    @UploadedFiles()
    uploadedFiles: {
      mainImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Body('existingImageIds') existingImageIdsString?: string,
  ) {
    // Ensure boolean conversion for FormData
    const data = {
      ...updateAchievementDto,
      isActive:
        updateAchievementDto.isActive !== undefined
          ? updateAchievementDto.isActive === true ||
            (updateAchievementDto.isActive as any) === 'true'
          : undefined,
      priority:
        updateAchievementDto.priority &&
        typeof updateAchievementDto.priority === 'string'
          ? parseInt(updateAchievementDto.priority, 10)
          : updateAchievementDto.priority,
    };
    const mainImage = uploadedFiles?.mainImage?.[0]?.buffer;
    const newImages = uploadedFiles?.images?.map((f) => f.buffer) || [];

    let existingImageIds: string[] | undefined;
    if (existingImageIdsString) {
      try {
        existingImageIds = JSON.parse(existingImageIdsString);
      } catch (e) {
        existingImageIds = undefined;
      }
    }

    return this.achievementsService.update(
      id,
      data,
      mainImage,
      newImages,
      existingImageIds,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(id);
  }

  @Get(':id/main-image')
  async getMainImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const buffer = await this.achievementsService.getMainImage(id);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(buffer);
  }

  @Get('image/:imageId')
  async getAdditionalImage(
    @Param('imageId') imageId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const buffer = await this.achievementsService.getAdditionalImage(imageId);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(buffer);
  }
}
