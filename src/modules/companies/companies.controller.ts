import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { CompaniesService } from './companies.service';
import { ModifierEntrepriseDto } from './dto/modifier-entreprise.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('entreprise')
@UseGuards(RolesGuard)
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  async obtenir(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.companiesService.obtenirEntreprise(entrepriseId);
  }

  @Get('statistiques')
  async statistiques(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.companiesService.statistiquesGenerales(entrepriseId);
  }

  @Patch()
  @Roles(RoleType.ADMIN)
  async modifier(
    @Body() dto: ModifierEntrepriseDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.companiesService.modifierEntreprise(entrepriseId, dto);
  }
}
