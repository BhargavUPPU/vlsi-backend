import { Module } from '@nestjs/common';
import { ClubMembersService } from './club-members.service';
import { ClubMembersController } from './club-members.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClubMembersController],
  providers: [ClubMembersService],
  exports: [ClubMembersService],
})
export class ClubMembersModule {}
