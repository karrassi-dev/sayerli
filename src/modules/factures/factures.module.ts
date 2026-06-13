import { Module } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { FacturesController, FacturesPublicController } from './factures.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [FacturesController, FacturesPublicController],
  providers: [FacturesService],
  exports: [FacturesService],
})
export class FacturesModule {}
