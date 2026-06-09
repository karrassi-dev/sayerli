import { Controller, Get } from '@nestjs/common';
import { DashboardAnalyticsService } from './dashboard.service';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardAnalyticsService) {}

  @Get('analytics')
  analytics(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.service.getAnalytics(entrepriseId);
  }
}
