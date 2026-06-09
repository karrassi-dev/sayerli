import { Module } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { FacturesController, FacturesPublicController } from './factures.controller';

@Module({
  controllers: [FacturesController, FacturesPublicController],
  providers: [FacturesService],
  exports: [FacturesService],
})
export class FacturesModule {}
