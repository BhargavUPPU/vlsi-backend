import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { PlacementPrepService } from './placement-prep.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('placementPrep')
export class PlacementPrepController {
  constructor(private readonly placementPrepService: PlacementPrepService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createDto: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    console.log('Creating Placement Prep with data:', createDto);
    console.log('Image received:', image ? `Yes (${image.size} bytes)` : 'No');
    return this.placementPrepService.create(createDto, image?.buffer);
  }

  @Get()
  findAll() {
    return this.placementPrepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placementPrepService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    console.log('Updating Placement Prep:', id);
    return this.placementPrepService.update(id, updateDto, image?.buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placementPrepService.remove(id);
  }

  @Get(':id/image')
  async getImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const image = await this.placementPrepService.getImage(id);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(Buffer.from(image));
  }
}
