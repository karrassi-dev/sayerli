import { Module } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { FacturesController, FacturesPublicController } from './factures.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [NotificationsModule, EmailModule, LogsModule],
  controllers: [FacturesController, FacturesPublicController],
  providers: [FacturesService],
  exports: [FacturesService],
})
export class FacturesModule {}
