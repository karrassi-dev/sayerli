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
import { StatutFacture } from '@prisma/client';
import { FacturesService } from './factures.service';
import { CreerFactureDto } from './dto/creer-facture.dto';
import { ModifierStatutFactureDto } from './dto/modifier-statut-facture.dto';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('factures')
export class FacturesController {
  constructor(private facturesService: FacturesService) {}

  @Get('tableau-de-bord')
  async tableauDeBord(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.facturesService.tableauDeBord(entrepriseId);
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

  @Delete(':id')
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.facturesService.supprimerFacture(id, entrepriseId);
  }
}
