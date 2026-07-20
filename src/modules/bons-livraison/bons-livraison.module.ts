import { Module } from '@nestjs/common';
import { BonsLivraisonService } from './bons-livraison.service';
import { BonsLivraisonController, PublicBLController } from './bons-livraison.controller';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [BonsLivraisonController, PublicBLController],
  providers: [BonsLivraisonService],
  exports: [BonsLivraisonService],
})
export class BonsLivraisonModule {}
