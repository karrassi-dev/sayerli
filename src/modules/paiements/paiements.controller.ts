import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { MethodePaiement, RoleType } from '@prisma/client';
import { PaiementsService } from './paiements.service';
import { CreerPaiementDto } from './dto/creer-paiement.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('paiements')
export class PaiementsController {
  constructor(private paiementsService: PaiementsService) {}

  @Get('statistiques')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT, RoleType.CAISSIER)
  @Permission('paiements.read')
  async statistiques(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.paiementsService.statistiques(entrepriseId);
  }

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT, RoleType.CAISSIER)
  @Permission('paiements.read')
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('factureId') factureId?: string,
    @Query('methode') methode?: MethodePaiement,
    @Query('recherche') recherche?: string,
  ) {
    return this.paiementsService.listerPaiements(entrepriseId, factureId, methode, recherche);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT, RoleType.CAISSIER)
  @Permission('paiements.read')
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.obtenirPaiement(id, entrepriseId);
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.RESPONSABLE_RECOUVREMENT, RoleType.CAISSIER)
  @Permission('paiements.create')
  async enregistrer(
    @Body() dto: CreerPaiementDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.enregistrerPaiement(dto, entrepriseId);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE)
  @Permission('paiements.delete')
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.supprimerPaiement(id, entrepriseId);
  }
}
