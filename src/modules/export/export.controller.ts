import { Controller, Get, Query } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { ExportService } from './export.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('data')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE)
  async exporter(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('types') types?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    const typesList = types
      ? types.split(',').filter(Boolean)
      : ['clients', 'devis', 'factures', 'paiements'];
    return this.exportService.exporterDonnees(
      entrepriseId,
      typesList,
      dateDebut,
      dateFin,
    );
  }
}
