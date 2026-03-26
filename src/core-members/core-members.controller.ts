import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  Put,
  Query,
} from '@nestjs/common';
import { CoreMembersService } from './core-members.service';
import { CreateCoreMemberDto } from './dto/create-core-member.dto';
import { UpdateCoreMemberDto } from './dto/update-core-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {SuperAdminGuard} from '../auth/guards/superadmin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('coreMembers')
export class CoreMembersController {
  constructor(private readonly coreMembersService: CoreMembersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCoreMemberDto: CreateCoreMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.coreMembersService.create(
      createCoreMemberDto,
      file?.buffer,
    );
  }

  @Get()
  findAll(
    @Query('academicYear') academicYear?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const opts: any = {};
    if (academicYear) opts.academicYear = academicYear;
    if (page) opts.page = parseInt(page as any, 10);
    if (limit) opts.limit = parseInt(limit as any, 10);

    return this.coreMembersService.findAll(opts);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.coreMembersService.findByCategory(category);
  }

  @Get('team/:teamCategory')
  findByTeamCategory(@Param('teamCategory') teamCategory: string) {
    return this.coreMembersService.findByTeamCategory(teamCategory);
  }

  @Get('year/:year')
  findByYear(@Param('year') year: string) {
    return this.coreMembersService.findByYear(year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coreMembersService.findOne(id);
  }

  @Get(':id/image')
  async getImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @Query('size') size?: string,
  ) {
    const s = size ? parseInt(size, 10) : undefined;
    const buf = await this.coreMembersService.getImageBuffer(id, s);
    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, immutable', // 24 hours
      'ETag': `"member-${id}-${size || 'original'}"`,
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(buf);
  }

  @Get(':id/thumbnail')
  async getThumbnail(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const buf = await this.coreMembersService.getImageBuffer(id, 300);
    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=604800, immutable', // 7 days
      'ETag': `"member-thumb-${id}"`,
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(buf);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateCoreMemberDto: UpdateCoreMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.coreMembersService.update(
      id,
      updateCoreMemberDto,
      file?.buffer,
    );
  }

  @UseGuards(JwtAuthGuard,SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coreMembersService.remove(id);
  }
}
