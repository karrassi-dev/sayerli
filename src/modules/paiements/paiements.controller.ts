import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MethodePaiement } from '@prisma/client';
import { PaiementsService } from './paiements.service';
import { CreerPaiementDto } from './dto/creer-paiement.dto';
import { ModifierPaiementDto } from './dto/modifier-paiement.dto';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('paiements')
export class PaiementsController {
  constructor(private paiementsService: PaiementsService) {}

  @Get('statistiques')
  async statistiques(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.paiementsService.statistiques(entrepriseId);
  }

  @Get()
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('factureId') factureId?: string,
    @Query('methode') methode?: MethodePaiement,
    @Query('recherche') recherche?: string,
  ) {
    return this.paiementsService.listerPaiements(entrepriseId, factureId, methode, recherche);
  }

  @Get(':id')
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.obtenirPaiement(id, entrepriseId);
  }

  @Post()
  async enregistrer(
    @Body() dto: CreerPaiementDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.enregistrerPaiement(dto, entrepriseId);
  }

  @Patch(':id')
  async modifier(
    @Param('id') id: string,
    @Body() dto: ModifierPaiementDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.modifierPaiement(id, dto, entrepriseId);
  }

  @Delete(':id')
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.paiementsService.supprimerPaiement(id, entrepriseId);
  }
}
