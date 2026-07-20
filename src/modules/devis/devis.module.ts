import { Module } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisController, DevisPublicController } from './devis.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [NotificationsModule, LogsModule],
  controllers: [DevisController, DevisPublicController],
  providers: [DevisService],
  exports: [DevisService],
})
export class DevisModule {}
