import { Controller, Get, Query } from '@nestjs/common';
import { RoleType, TypeClient } from '@prisma/client';
import { DashboardAnalyticsService } from './dashboard.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardAnalyticsService) {}

  @Get('analytics')
  @Roles(RoleType.PROPRIETAIRE, RoleType.ADMIN, RoleType.MANAGER, RoleType.DAF, RoleType.COMPTABLE, RoleType.COMPTABLE_EXTERNE, RoleType.COMMERCIAL, RoleType.COMMERCIAL_PROPRE, RoleType.ASSOCIE)
  @Permission('dashboard')
  analytics(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('typeClient') typeClient?: string,
  ) {
    const validTypes = ['PARTICULIER', 'ENTREPRISE', 'FREELANCE'];
    const type = validTypes.includes(typeClient ?? '') ? (typeClient as TypeClient) : undefined;
    return this.service.getAnalytics(entrepriseId, type);
  }
}
