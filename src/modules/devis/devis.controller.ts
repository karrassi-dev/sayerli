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
import { StatutDevis } from '@prisma/client';
import { DevisService } from './devis.service';
import { CreerDevisDto } from './dto/creer-devis.dto';
import { ModifierStatutDevisDto } from './dto/modifier-statut-devis.dto';
import { Public } from '../../common/decorators/public.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('devis')
export class DevisController {
  constructor(private devisService: DevisService) {}

  @Get()
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('statut') statut?: StatutDevis,
    @Query('clientId') clientId?: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.devisService.listerDevis(entrepriseId, statut, clientId, recherche);
  }

  @Get(':id')
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.obtenirDevis(id, entrepriseId);
  }

  @Get(':id/pdf')
  async obtenirPourPdf(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    // Returns full devis data for client-side PDF/print rendering
    return this.devisService.obtenirDevis(id, entrepriseId);
  }

  @Post()
  async creer(
    @Body() dto: CreerDevisDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.creerDevis(dto, entrepriseId);
  }

  @Put(':id')
  async modifier(
    @Param('id') id: string,
    @Body() dto: CreerDevisDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.modifierDevis(id, dto, entrepriseId);
  }

  @Patch(':id/statut')
  async modifierStatut(
    @Param('id') id: string,
    @Body() dto: ModifierStatutDevisDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.modifierStatut(id, dto, entrepriseId);
  }

  @Post(':id/lien-public')
  async genererLien(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('jours') jours?: number,
  ) {
    return this.devisService.genererLienPublic(id, entrepriseId, jours);
  }

  @Post(':id/convertir-facture')
  async convertirEnFacture(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.devisService.convertirEnFacture(id, entrepriseId);
  }

  @Delete(':id')
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
