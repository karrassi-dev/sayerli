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
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('factures')
export class FacturesController {
  constructor(private facturesService: FacturesService) {}

  @Get('tableau-de-bord')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.COMPTABLE)
  async tableauDeBord(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.facturesService.tableauDeBord(entrepriseId);
  }

  @Get('declarations')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE)
  async listerDeclarations(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('statut') statut?: StatutDeclaration,
  ) {
    return this.facturesService.listerDeclarations(entrepriseId, statut);
  }

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.COMPTABLE)
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('statut') statut?: StatutFacture,
    @Query('clientId') clientId?: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.facturesService.listerFactures(entrepriseId, statut, clientId, recherche);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.COMPTABLE)
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.obtenirFacture(id, entrepriseId);
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async creer(
    @Body() dto: CreerFactureDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.creerFacture(dto, entrepriseId);
  }

  @Put(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async modifier(
    @Param('id') id: string,
    @Body() dto: CreerFactureDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.modifierFacture(id, dto, entrepriseId);
  }

  @Patch(':id/statut')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async modifierStatut(
    @Param('id') id: string,
    @Body() dto: ModifierStatutFactureDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.modifierStatut(id, dto, entrepriseId);
  }

  @Post(':id/envoyer')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async envoyer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.envoyerFacture(id, entrepriseId);
  }

  @Patch('declarations/:id/approuver')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE)
  async approuverDeclaration(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.approuverDeclaration(id, entrepriseId);
  }

  @Patch('declarations/:id/rejeter')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMPTABLE)
  async rejeterDeclaration(
    @Param('id') id: string,
    @Body() dto: RejeterDeclarationDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.rejeterDeclaration(id, entrepriseId, dto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
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
