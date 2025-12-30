import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
  UseInterceptors, UploadedFile, Res, StreamableFile,
} from '@nestjs/common';
import { TextbooksService } from './textbooks.service';
import { CreateTextbookDto, UpdateTextbookDto } from './dto/textbook.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('textbooks')
export class TextbooksController {
  constructor(private readonly textbooksService: TextbooksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() dto: CreateTextbookDto, @UploadedFile() file?: Express.Multer.File) {
    return this.textbooksService.create(dto, file?.buffer);
  }

  @Get()
  findAll() {
    return this.textbooksService.findAll();
  }

  @Get('subject/:subject')
  findBySubject(@Param('subject') subject: string) {
    return this.textbooksService.findBySubject(subject);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.textbooksService.findOne(id);
  }

  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const image = await this.textbooksService.getImage(id);
    res.set({ 'Content-Type': 'image/jpeg', 'Content-Disposition': 'inline' });
    return new StreamableFile(Buffer.from(image));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() dto: UpdateTextbookDto, @UploadedFile() file?: Express.Multer.File) {
    return this.textbooksService.update(id, dto, file?.buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textbooksService.remove(id);
  }
}
