import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DashboardController } from './dashboard.controller';
import { DashboardAnalyticsService } from './dashboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardAnalyticsService],
})
export class DashboardModule {}
