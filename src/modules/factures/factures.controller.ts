import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StatutFacture, StatutDeclaration } from '@prisma/client';
import { FacturesService } from './factures.service';
import { CreerFactureDto } from './dto/creer-facture.dto';
import { ModifierStatutFactureDto } from './dto/modifier-statut-facture.dto';
import { DeclarerPaiementDto } from './dto/declarer-paiement.dto';
import { RejeterDeclarationDto } from './dto/rejeter-declaration.dto';
import { Public } from '../../common/decorators/public.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('factures')
export class FacturesController {
  constructor(private facturesService: FacturesService) {}

  @Get('tableau-de-bord')
  async tableauDeBord(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.facturesService.tableauDeBord(entrepriseId);
  }

  @Get('declarations')
  async listerDeclarations(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('statut') statut?: StatutDeclaration,
  ) {
    return this.facturesService.listerDeclarations(entrepriseId, statut);
  }

  @Get()
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('statut') statut?: StatutFacture,
    @Query('clientId') clientId?: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.facturesService.listerFactures(entrepriseId, statut, clientId, recherche);
  }

  @Get(':id')
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.obtenirFacture(id, entrepriseId);
  }

  @Post()
  async creer(
    @Body() dto: CreerFactureDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.creerFacture(dto, entrepriseId);
  }

  @Put(':id')
  async modifier(
    @Param('id') id: string,
    @Body() dto: CreerFactureDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.modifierFacture(id, dto, entrepriseId);
  }

  @Patch(':id/statut')
  async modifierStatut(
    @Param('id') id: string,
    @Body() dto: ModifierStatutFactureDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.modifierStatut(id, dto, entrepriseId);
  }

  @Post(':id/envoyer')
  async envoyer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.envoyerFacture(id, entrepriseId);
  }

  @Patch('declarations/:id/approuver')
  async approuverDeclaration(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.approuverDeclaration(id, entrepriseId);
  }

  @Patch('declarations/:id/rejeter')
  async rejeterDeclaration(
    @Param('id') id: string,
    @Body() dto: RejeterDeclarationDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.rejeterDeclaration(id, entrepriseId, dto);
  }

  @Delete(':id')
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.supprimerFacture(id, entrepriseId);
  }
}

@Controller('public/factures')
export class FacturesPublicController {
  constructor(private facturesService: FacturesService) {}

  @Public()
  @Get(':token')
  async obtenirParToken(@Param('token') token: string) {
    return this.facturesService.obtenirFactureParToken(token);
  }

  @Public()
  @Post(':token/declarer-paiement')
  async declarerPaiement(
    @Param('token') token: string,
    @Body() dto: DeclarerPaiementDto,
  ) {
    return this.facturesService.declarerPaiement(token, dto);
  }
}
