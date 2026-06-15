import { Module } from '@nestjs/common';
import { PlanExpiryService } from './plan-expiry.service';
import { OverdueInvoicesService } from './overdue-invoices.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [PlanExpiryService, OverdueInvoicesService],
})
export class AdminModule {}
