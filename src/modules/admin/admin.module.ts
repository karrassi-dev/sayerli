import { Module } from '@nestjs/common';
import { PlanExpiryService } from './plan-expiry.service';

@Module({
  providers: [PlanExpiryService],
})
export class AdminModule {}
