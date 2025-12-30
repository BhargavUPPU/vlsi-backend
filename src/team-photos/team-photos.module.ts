import { Module } from '@nestjs/common';
import { TeamPhotosController } from './team-photos.controller';
import { TeamPhotosService } from './team-photos.service';

@Module({
  controllers: [TeamPhotosController],
  providers: [TeamPhotosService]
})
export class TeamPhotosModule {}
