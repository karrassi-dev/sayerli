import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreerClientDto } from './dto/creer-client.dto';
import { ModifierClientDto } from './dto/modifier-client.dto';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.clientsService.listerClients(entrepriseId, recherche);
  }

  @Get(':id')
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.obtenirClient(id, entrepriseId);
  }

  @Get(':id/statistiques')
  async statistiques(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.statistiquesClient(id, entrepriseId);
  }

  @Post()
  async creer(
    @Body() dto: CreerClientDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.creerClient(dto, entrepriseId);
  }

  @Patch(':id')
  async modifier(
    @Param('id') id: string,
    @Body() dto: ModifierClientDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.modifierClient(id, dto, entrepriseId);
  }

  @Delete(':id')
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.supprimerClient(id, entrepriseId);
  }
}
