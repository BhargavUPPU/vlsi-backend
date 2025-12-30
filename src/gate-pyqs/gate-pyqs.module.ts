import { Module } from '@nestjs/common';
import { GatePyqsController } from './gate-pyqs.controller';
import { GatePyqsService } from './gate-pyqs.service';

@Module({
  controllers: [GatePyqsController],
  providers: [GatePyqsService]
})
export class GatePyqsModule {}
