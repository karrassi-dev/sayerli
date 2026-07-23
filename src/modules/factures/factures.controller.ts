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
import { RoleType, StatutFacture, StatutDeclaration } from '@prisma/client';
import { FacturesService } from './factures.service';
import { CreerFactureDto } from './dto/creer-facture.dto';
import { ModifierStatutFactureDto } from './dto/modifier-statut-facture.dto';
import { DeclarerPaiementDto } from './dto/declarer-paiement.dto';
import { RejeterDeclarationDto } from './dto/rejeter-declaration.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('factures')
export class FacturesController {
  constructor(private facturesService: FacturesService) {}

  @Get('tableau-de-bord')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT, RoleType.CAISSIER, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT, RoleType.ASSOCIE)
  @Permission('factures.read')
  async tableauDeBord(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.facturesService.tableauDeBord(entrepriseId);
  }

  @Get('declarations')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT)
  @Permission('paiements.declarations')
  async listerDeclarations(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('statut') statut?: StatutDeclaration,
  ) {
    return this.facturesService.listerDeclarations(entrepriseId, statut);
  }

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT, RoleType.CAISSIER, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT, RoleType.ASSOCIE)
  @Permission('factures.read')
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('statut') statut?: StatutFacture,
    @Query('clientId') clientId?: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.facturesService.listerFactures(entrepriseId, statut, clientId, recherche);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT, RoleType.CAISSIER, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT, RoleType.ASSOCIE)
  @Permission('factures.read')
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.obtenirFacture(id, entrepriseId);
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE, RoleType.ASSISTANT)
  @Permission('factures.create')
  async creer(
    @Body() dto: CreerFactureDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.facturesService.creerFacture(dto, entrepriseId, userId, userNom);
  }

  @Put(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE, RoleType.ASSISTANT)
  @Permission('factures.edit')
  async modifier(
    @Param('id') id: string,
    @Body() dto: CreerFactureDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.facturesService.modifierFacture(id, dto, entrepriseId, userId, userNom);
  }

  @Patch(':id/statut')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE)
  @Permission('factures.edit')
  async modifierStatut(
    @Param('id') id: string,
    @Body() dto: ModifierStatutFactureDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.modifierStatut(id, dto, entrepriseId);
  }

  @Post(':id/envoyer')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE)
  @Permission('factures.send')
  async envoyer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.facturesService.envoyerFacture(id, entrepriseId, userId, userNom);
  }

  @Post(':id/relancer')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE, RoleType.RESPONSABLE_RECOUVREMENT)
  @Permission('factures.relance')
  async relancer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.facturesService.relancerFacture(id, entrepriseId, userId, userNom);
  }

  @Patch('declarations/:id/approuver')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT)
  @Permission('paiements.declarations')
  async approuverDeclaration(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.approuverDeclaration(id, entrepriseId);
  }

  @Patch('declarations/:id/rejeter')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT)
  @Permission('paiements.declarations')
  async rejeterDeclaration(
    @Param('id') id: string,
    @Body() dto: RejeterDeclarationDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.rejeterDeclaration(id, entrepriseId, dto);
  }

  @Patch(':id/annuler')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE)
  @Permission('factures.annuler')
  async annuler(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.facturesService.annulerFacture(id, entrepriseId, userId, userNom);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.PROPRIETAIRE)
  @Permission('factures.delete')
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.facturesService.supprimerFacture(id, entrepriseId, userId, userNom);
  }

  @Get(':id/dgi-documents')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE, RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE)
  @Permission('factures.read')
  async dgiDocuments(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.getDGIDocumentUrls(id, entrepriseId);
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

  @Public()
  @Get(':token/document-url')
  async documentUrl(@Param('token') token: string) {
    const url = await this.facturesService.getPublicDocumentUrl(token);
    return { url };
  }

  @Public()
  @Get(':token/xml-url')
  async xmlUrl(@Param('token') token: string) {
    const url = await this.facturesService.getPublicXmlUrl(token);
    return { url };
  }
}
