import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DeclarationsTVAController } from './declarations-tva.controller';
import { DeclarationsTVAService } from './declarations-tva.service';

@Module({
  imports: [PrismaModule],
  controllers: [DeclarationsTVAController],
  providers: [DeclarationsTVAService],
})
export class DeclarationsTVAModule {}
