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
import { GatePyqsService } from './gate-pyqs.service';
import { CreateGatePyqDto } from './dto/create-gate-pyq.dto';
import { UpdateGatePyqDto } from './dto/update-gate-pyq.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('gatePyqs')
export class GatePyqsController {
  constructor(private readonly gatePyqsService: GatePyqsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateGatePyqDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Ensure year is a number when using multipart/form-data
    const data = {
      ...dto,
      year: typeof dto.year === 'string' ? parseInt(dto.year, 10) : dto.year,
    };
    return this.gatePyqsService.create(data, file?.buffer);
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
    return this.gatePyqsService.findAll(query);
  }

  @Get('year/:year')
  findByYear(@Param('year') year: string) {
    return this.gatePyqsService.findByYear(Number(year));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gatePyqsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateGatePyqDto: UpdateGatePyqDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Ensure year is a number when using multipart/form-data
    const data = {
      ...updateGatePyqDto,
      year:
        updateGatePyqDto.year && typeof updateGatePyqDto.year === 'string'
          ? parseInt(updateGatePyqDto.year, 10)
          : updateGatePyqDto.year,
    };
    return this.gatePyqsService.update(id, data, file?.buffer);
  }

  @Get(':id/image')
  async getImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const image = await this.gatePyqsService.getImage(id);
    res.set({ 'Content-Type': 'image/jpeg', 'Content-Disposition': 'inline' });
    return new StreamableFile(Buffer.from(image));
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gatePyqsService.remove(id);
  }
}
