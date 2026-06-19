import { Module } from '@nestjs/common';
import { PlanExpiryService } from './plan-expiry.service';
import { OverdueInvoicesService } from './overdue-invoices.service';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [SuperAdminController],
  providers: [PlanExpiryService, OverdueInvoicesService, SuperAdminService],
})
export class AdminModule {}
