import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Res,
  StreamableFile,
  Query,
} from '@nestjs/common';
import { MagazinesService } from './magazines.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('magazines')
export class MagazinesController {
  constructor(private readonly magazinesService: MagazinesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createDto: any, @UploadedFile() image?: Express.Multer.File) {
    console.log('Creating Magazine with data:', createDto);
    console.log('Image received:', image ? `Yes (${image.size} bytes)` : 'No');
    return this.magazinesService.create(createDto, image?.buffer);
  }

  @Get()
  findAll(
    @Query()
    query?: {
      search?: string;
      category?: string;
      page?: string;
      limit?: string;
    },
  ) {
    return this.magazinesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.magazinesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    console.log('Updating Magazine:', id);
    return this.magazinesService.update(id, updateDto, image?.buffer);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.magazinesService.remove(id);
  }

  @Get(':id/image')
  async getImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const image = await this.magazinesService.getImage(id);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(Buffer.from(image));
  }
}
