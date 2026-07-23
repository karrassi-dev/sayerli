import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DGIService } from './dgi.service';
import { UBLService } from './ubl.service';
import { PDFService } from './pdf.service';
import { SignatureService } from './signature.service';
import { SimplTVAService } from './simpl-tva.service';
import { DGIR2Service } from './dgi-r2.service';

@Module({
  imports: [ConfigModule],
  providers: [DGIService, UBLService, PDFService, SignatureService, SimplTVAService, DGIR2Service],
  exports: [DGIService],
})
export class DGIModule {}
