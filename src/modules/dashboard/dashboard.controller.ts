import { Controller, Get, Query } from '@nestjs/common';
import { TypeClient } from '@prisma/client';
import { DashboardAnalyticsService } from './dashboard.service';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardAnalyticsService) {}

  @Get('analytics')
  analytics(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('typeClient') typeClient?: string,
  ) {
    const validTypes = ['PARTICULIER', 'ENTREPRISE', 'FREELANCE'];
    const type = validTypes.includes(typeClient ?? '') ? (typeClient as TypeClient) : undefined;
    return this.service.getAnalytics(entrepriseId, type);
  }
}
