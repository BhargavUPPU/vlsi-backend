import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
  UseInterceptors, UploadedFile, Res, StreamableFile, Query,
} from '@nestjs/common';
import { NptelLecturesService } from './nptel-lectures.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {SuperAdminGuard} from '../auth/guards/superadmin.guard';
import { FileInterceptor } from   '@nestjs/platform-express';
import { Response } from 'express';

@Controller('nptelLectures')
export class NptelLecturesController {
  constructor(private readonly service: NptelLecturesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() data: any, @UploadedFile() file?: Express.Multer.File) {
    return this.service.create(data, file?.buffer);
  }

  @Get()
  findAll(@Query() query?: { search?: string; category?: string; page?: string; limit?: string }) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const image = await this.service.getImage(id);
    res.set({ 'Content-Type': 'image/jpeg', 'Content-Disposition': 'inline' });
    return new StreamableFile(Buffer.from(image));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() data: any, @UploadedFile() file?: Express.Multer.File) {
    return this.service.update(id, data, file?.buffer);
  }

  @UseGuards(JwtAuthGuard,SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
