import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto, UpdateTestDto } from './dto/test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {SuperAdminGuard} from '../auth/guards/superadmin.guard';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testsService.create(createTestDto);
  }

  @Get()
  findAll(@Query('status') status?: string, @Query('subject') subject?: string) {
    if (status) return this.testsService.findByStatus(status);
    if (subject) return this.testsService.findBySubject(subject);
    return this.testsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.update(id, updateTestDto);
  }

  @UseGuards(JwtAuthGuard,SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }
}
