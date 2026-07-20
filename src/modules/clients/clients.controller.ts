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
import { RoleType } from '@prisma/client';
import { ClientsService } from './clients.service';
import { CreerClientDto } from './dto/creer-client.dto';
import { ModifierClientDto } from './dto/modifier-client.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT)
  @Permission('clients.read')
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.clientsService.listerClients(entrepriseId, recherche);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT)
  @Permission('clients.read')
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.obtenirClient(id, entrepriseId);
  }

  @Get(':id/lien-portal')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT)
  @Permission('clients.read')
  async lienPortal(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.lienPortal(id, entrepriseId);
  }

  @Get(':id/statistiques')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT, RoleType.COMPTABLE_EXTERNE, RoleType.RESPONSABLE_RECOUVREMENT)
  @Permission('clients.read')
  async statistiques(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.statistiquesClient(id, entrepriseId);
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT)
  @Permission('clients.create')
  async creer(
    @Body() dto: CreerClientDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.creerClient(dto, entrepriseId);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT)
  @Permission('clients.edit')
  async modifier(
    @Param('id') id: string,
    @Body() dto: ModifierClientDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.modifierClient(id, dto, entrepriseId);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE)
  @Permission('clients.delete')
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.clientsService.supprimerClient(id, entrepriseId);
  }
}
