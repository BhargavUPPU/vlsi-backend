import { Module } from '@nestjs/common';
import { VlsiMaterialsController } from './vlsi-materials.controller';
import { VlsiMaterialsService } from './vlsi-materials.service';

@Module({
  controllers: [VlsiMaterialsController],
  providers: [VlsiMaterialsService]
})
export class VlsiMaterialsModule {}
