import { Module } from '@nestjs/common';
import { NptelLecturesService } from './nptel-lectures.service';
import { NptelLecturesController } from './nptel-lectures.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NptelLecturesController],
  providers: [NptelLecturesService],
})
export class NptelLecturesModule {}
