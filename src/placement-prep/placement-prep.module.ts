import { Module } from '@nestjs/common';
import { PlacementPrepController } from './placement-prep.controller';
import { PlacementPrepService } from './placement-prep.service';

@Module({
  controllers: [PlacementPrepController],
  providers: [PlacementPrepService]
})
export class PlacementPrepModule {}
