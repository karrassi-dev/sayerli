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
import { RoleType, StatutDevis } from '@prisma/client';
import { DevisService } from './devis.service';
import { CreerDevisDto } from './dto/creer-devis.dto';
import { ModifierStatutDevisDto } from './dto/modifier-statut-devis.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('devis')
export class DevisController {
  constructor(private devisService: DevisService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL)
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('statut') statut?: StatutDevis,
    @Query('clientId') clientId?: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.devisService.listerDevis(entrepriseId, statut, clientId, recherche);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL)
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.obtenirDevis(id, entrepriseId);
  }

  @Get(':id/pdf')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL)
  async obtenirPourPdf(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.obtenirDevis(id, entrepriseId);
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL)
  async creer(
    @Body() dto: CreerDevisDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.creerDevis(dto, entrepriseId);
  }

  @Put(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL)
  async modifier(
    @Param('id') id: string,
    @Body() dto: CreerDevisDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.modifierDevis(id, dto, entrepriseId);
  }

  @Patch(':id/statut')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL)
  async modifierStatut(
    @Param('id') id: string,
    @Body() dto: ModifierStatutDevisDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.modifierStatut(id, dto, entrepriseId);
  }

  @Post(':id/lien-public')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL)
  async genererLien(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.genererLienPublic(id, entrepriseId);
  }

  @Post(':id/dupliquer')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL)
  async dupliquer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.dupliquerDevis(id, entrepriseId);
  }

  @Post(':id/convertir-facture')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async convertirEnFacture(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.convertirEnFacture(id, entrepriseId);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.supprimerDevis(id, entrepriseId);
  }
}

@Controller('public/devis')
export class DevisPublicController {
  constructor(private devisService: DevisService) {}

  @Public()
  @Get(':token')
  async obtenirParToken(@Param('token') token: string) {
    return this.devisService.obtenirDevisParToken(token);
  }

  @Public()
  @Post(':token/accepter')
  async accepter(@Param('token') token: string) {
    return this.devisService.repondreDevisPublic(token, 'accepter');
  }

  @Public()
  @Post(':token/refuser')
  async refuser(@Param('token') token: string) {
    return this.devisService.repondreDevisPublic(token, 'refuser');
  }
}
