import { Controller, Get, Query } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { LogsService } from './logs.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Get()
  @Roles(RoleType.PROPRIETAIRE, RoleType.ADMIN)
  @Permission('settings')
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('userId') userId?: string,
    @Query('entityType') entityType?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
    @Query('page') page?: string,
  ) {
    return this.logsService.lister(entrepriseId, {
      userId,
      entityType,
      dateDebut,
      dateFin,
      page: page ? parseInt(page, 10) : 1,
    });
  }

  @Get('membres')
  @Roles(RoleType.PROPRIETAIRE, RoleType.ADMIN)
  @Permission('settings')
  async membres(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.logsService.listerMembres(entrepriseId);
  }
}
