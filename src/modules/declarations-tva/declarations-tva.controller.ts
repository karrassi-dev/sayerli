import { Controller, Get, Query } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { DeclarationsTVAService } from './declarations-tva.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('declarations-tva')
export class DeclarationsTVAController {
  constructor(private service: DeclarationsTVAService) {}

  @Get('calculer')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE)
  @Permission('export')
  async calculer(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('debut') debut: string,
    @Query('fin') fin: string,
    @Query('tauxEUR') tauxEUR?: string,
    @Query('tauxUSD') tauxUSD?: string,
  ) {
    return this.service.calculer(
      entrepriseId,
      debut,
      fin,
      tauxEUR ? parseFloat(tauxEUR) : undefined,
      tauxUSD ? parseFloat(tauxUSD) : undefined,
    );
  }
}
