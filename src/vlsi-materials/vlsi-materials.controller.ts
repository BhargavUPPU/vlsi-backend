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
  UploadedFile,
  UseInterceptors,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { VlsiMaterialsService } from './vlsi-materials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('vlsiMaterials')
export class VlsiMaterialsController {
  constructor(private readonly vlsiMaterialsService: VlsiMaterialsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createDto: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    console.log('Creating VLSI Material with data:', createDto);
    console.log('Image received:', image ? `Yes (${image.size} bytes)` : 'No');
    return this.vlsiMaterialsService.create(createDto, image?.buffer);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.vlsiMaterialsService.findByCategory(category);
    }
    return this.vlsiMaterialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vlsiMaterialsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    console.log('Updating VLSI Material:', id);
    return this.vlsiMaterialsService.update(id, updateDto, image?.buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vlsiMaterialsService.remove(id);
  }

  @Get(':id/image')
  async getImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const image = await this.vlsiMaterialsService.getImage(id);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(Buffer.from(image));
  }
}
