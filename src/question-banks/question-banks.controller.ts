import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuestionBanksService } from './question-banks.service';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questionBanks')
export class QuestionBanksController {
  constructor(private readonly questionBanksService: QuestionBanksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createQuestionBankDto: CreateQuestionBankDto) {
    return this.questionBanksService.create(createQuestionBankDto);
  }

  @Get()
  findAll() {
    return this.questionBanksService.findAll();
  }

  @Get('subject/:subject')
  findBySubject(@Param('subject') subject: string) {
    return this.questionBanksService.findBySubject(subject);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionBanksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionBankDto: UpdateQuestionBankDto) {
    return this.questionBanksService.update(id, updateQuestionBankDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionBanksService.remove(id);
  }
}
