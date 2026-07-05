import { Module } from '@nestjs/common';
import { RelancesService } from './relances.service';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, EmailModule],
  providers: [RelancesService],
})
export class RelancesModule {}
