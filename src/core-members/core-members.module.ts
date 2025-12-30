import { Module } from '@nestjs/common';
import { CoreMembersService } from './core-members.service';
import { CoreMembersController } from './core-members.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CoreMembersController],
  providers: [CoreMembersService],
  exports: [CoreMembersService],
})
export class CoreMembersModule {}
