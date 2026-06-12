import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlanExpiryService {
  private readonly logger = new Logger(PlanExpiryService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireOverduePlans() {
    const now = new Date();

    const expired = await this.prisma.entreprise.updateMany({
      where: {
        plan: { not: 'STARTER' },
        planExpiration: { lt: now },
      },
      data: {
        plan: 'STARTER',
        planDebut: null,
        planExpiration: null,
      },
    });

    if (expired.count > 0) {
      this.logger.log(`Downgraded ${expired.count} entreprise(s) to STARTER — plan expired.`);
    }
  }
}
