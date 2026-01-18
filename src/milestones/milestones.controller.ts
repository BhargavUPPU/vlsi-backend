import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createMilestoneDto: CreateMilestoneDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.milestonesService.create(createMilestoneDto, image);
  }

  @Get()
  findAll(
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    
    if (year) filters.year = year;
    if (category) filters.category = category;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return this.milestonesService.findAll(filters);
  }

  @Get('years')
  getAvailableYears() {
    return this.milestonesService.getAvailableYears();
  }

  @Get('categories')
  getAvailableCategories() {
    return this.milestonesService.getAvailableCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.milestonesService.findOne(id);
  }

  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    try {
      const imageBuffer = await this.milestonesService.getImage(id);
      
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Length': imageBuffer.length,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      });
      
      res.send(Buffer.from(imageBuffer));
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.milestonesService.update(id, updateMilestoneDto, image);
  }

  @Patch(':id/priority')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  updatePriority(
    @Param('id') id: string,
    @Body('priority', ParseIntPipe) priority: number,
  ) {
    return this.milestonesService.updatePriority(id, priority);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  toggleActive(@Param('id') id: string) {
    return this.milestonesService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  remove(@Param('id') id: string) {
    return this.milestonesService.remove(id);
  }

  @Delete(':id/hard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  hardDelete(@Param('id') id: string) {
    return this.milestonesService.hardDelete(id);
  }
}
