import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MethodePaiement, RoleType } from '@prisma/client';
import { PaiementsService } from './paiements.service';
import { CreerPaiementDto } from './dto/creer-paiement.dto';
import { ModifierPaiementDto } from './dto/modifier-paiement.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('paiements')
export class PaiementsController {
  constructor(private paiementsService: PaiementsService) {}

  @Get('statistiques')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE)
  async statistiques(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.paiementsService.statistiques(entrepriseId);
  }

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE)
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('factureId') factureId?: string,
    @Query('methode') methode?: MethodePaiement,
    @Query('recherche') recherche?: string,
  ) {
    return this.paiementsService.listerPaiements(entrepriseId, factureId, methode, recherche);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE)
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.obtenirPaiement(id, entrepriseId);
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE)
  async enregistrer(
    @Body() dto: CreerPaiementDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.enregistrerPaiement(dto, entrepriseId);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE)
  async modifier(
    @Param('id') id: string,
    @Body() dto: ModifierPaiementDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.modifierPaiement(id, dto, entrepriseId);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.supprimerPaiement(id, entrepriseId);
  }
}
