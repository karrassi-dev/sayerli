import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { DeclarationsTVAController } from './declarations-tva.controller';
import { DeclarationsTVAService } from './declarations-tva.service';
import { DeclarationTVAPDFService } from './declarations-tva-pdf.service';
import { DeclarationsTVAAutoService } from './declarations-tva-auto.service';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [DeclarationsTVAController],
  providers: [DeclarationsTVAService, DeclarationTVAPDFService, DeclarationsTVAAutoService],
})
export class DeclarationsTVAModule {}
