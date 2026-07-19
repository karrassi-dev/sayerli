import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { ExportService } from './export.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { PLAN_LIMITS } from '../../common/utils/plan-limits';

@Controller('export')
export class ExportController {
  constructor(
    private exportService: ExportService,
    private prisma: PrismaService,
  ) {}

  @Get('data')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE)
  @Permission('export')
  async exporter(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('types') types?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    const typesList = types
      ? types.split(',').filter(Boolean)
      : ['clients', 'devis', 'factures', 'paiements'];

    const isJournal = typesList.includes('journal');
    if (isJournal) {
      const entreprise = await this.prisma.entreprise.findUnique({
        where: { id: entrepriseId },
        select: { plan: true },
      });
      if (!entreprise || !PLAN_LIMITS[entreprise.plan].journalDesVentes) {
        throw new HttpException(
          { message: 'PLAN_LIMIT', errors: { code: 'PLAN_LIMIT', resource: 'journal', limite: 0, actuel: 1 } },
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
    }

    return this.exportService.exporterDonnees(
      entrepriseId,
      typesList,
      dateDebut,
      dateFin,
    );
  }
}
