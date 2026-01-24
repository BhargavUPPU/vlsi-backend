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
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { QuestionBanksService } from './question-banks.service';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('questionBanks')
export class QuestionBanksController {
  constructor(private readonly questionBanksService: QuestionBanksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createQuestionBankDto: CreateQuestionBankDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.questionBanksService.create(
      createQuestionBankDto,
      file?.buffer,
    );
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
    return this.questionBanksService.findAll(query);
  }

  @Get('subject/:subject')
  findBySubject(@Param('subject') subject: string) {
    return this.questionBanksService.findBySubject(subject);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionBanksService.findOne(id);
  }

  @Get(':id/image')
  async getImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const image = await this.questionBanksService.getImage(id);
    res.set({ 'Content-Type': 'image/jpeg', 'Content-Disposition': 'inline' });
    return new StreamableFile(Buffer.from(image));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateQuestionBankDto: UpdateQuestionBankDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.questionBanksService.update(
      id,
      updateQuestionBankDto,
      file?.buffer,
    );
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionBanksService.remove(id);
  }
}
