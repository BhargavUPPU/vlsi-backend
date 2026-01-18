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
} from '@nestjs/common';
import { ClubMembersService } from './club-members.service';
import { CreateClubMemberDto } from './dto/create-club-member.dto';
import { UpdateClubMemberDto } from './dto/update-club-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {SuperAdminGuard} from '../auth/guards/superadmin.guard';

@Controller('clubMembers')
export class ClubMembersController {
  constructor(private readonly clubMembersService: ClubMembersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createClubMemberDto: CreateClubMemberDto) {
    return this.clubMembersService.create(createClubMemberDto);
  }

  @Get()
  findAll() {
    return this.clubMembersService.findAll();
  }

  @Get('year/:year')
  findByYear(@Param('year') year: string) {
    return this.clubMembersService.findByYear(year);
  }

  @Get('section/:section')
  findBySection(@Param('section') section: string) {
    return this.clubMembersService.findBySection(section);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubMembersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClubMemberDto: UpdateClubMemberDto,
  ) {
    return this.clubMembersService.update(id, updateClubMemberDto);
  }

  @UseGuards(JwtAuthGuard,SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubMembersService.remove(id);
  }
}
