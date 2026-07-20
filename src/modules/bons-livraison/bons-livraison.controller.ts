import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { BonsLivraisonService } from './bons-livraison.service';
import { CreerBonLivraisonDto } from './dto/creer-bon-livraison.dto';
import { ModifierBonLivraisonDto } from './dto/modifier-bon-livraison.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('bons-livraison')
export class BonsLivraisonController {
  constructor(private service: BonsLivraisonService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT, RoleType.COMPTABLE, RoleType.COMPTABLE_EXTERNE, RoleType.DAF)
  @Permission('bons-livraison.read')
  lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('statut') statut?: string,
    @Query('clientId') clientId?: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.service.lister(entrepriseId, statut, clientId, recherche);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT, RoleType.COMPTABLE, RoleType.COMPTABLE_EXTERNE, RoleType.DAF)
  @Permission('bons-livraison.read')
  obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.service.obtenir(id, entrepriseId);
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT)
  @Permission('bons-livraison.manage')
  creer(
    @Body() dto: CreerBonLivraisonDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.creer(dto, entrepriseId, userId, userNom);
  }

  @Put(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT)
  @Permission('bons-livraison.manage')
  modifier(
    @Param('id') id: string,
    @Body() dto: ModifierBonLivraisonDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.modifier(id, dto, entrepriseId, userId, userNom);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE)
  @Permission('bons-livraison.manage')
  supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.supprimer(id, entrepriseId, userId, userNom);
  }

  @Post('depuis-devis/:devisId')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT)
  @Permission('bons-livraison.manage')
  creerDepuisDevis(
    @Param('devisId') devisId: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.creerDepuisDevis(devisId, entrepriseId, userId, userNom);
  }

  @Post(':id/envoyer')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT)
  @Permission('bons-livraison.manage')
  envoyer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.envoyer(id, entrepriseId, userId, userNom);
  }

  @Post(':id/marquer-livre')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT)
  @Permission('bons-livraison.manage')
  marquerLivre(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.marquerLivre(id, entrepriseId, userId, userNom);
  }

  @Post(':id/dupliquer')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT)
  @Permission('bons-livraison.manage')
  dupliquer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.dupliquer(id, entrepriseId, userId, userNom);
  }

  @Post(':id/convertir-en-facture')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE)
  @Permission('factures.create')
  convertirEnFacture(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.convertirEnFacture(id, entrepriseId, userId, userNom);
  }
}

// Public controller (no auth) — separate to keep guard clean
@Controller('public/bl')
export class PublicBLController {
  constructor(private service: BonsLivraisonService) {}

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  @Get(':token')
  obtenirParToken(@Param('token') token: string) {
    return this.service.obtenirParToken(token);
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post(':token/confirmer-reception')
  confirmerReception(@Param('token') token: string) {
    return this.service.confirmerReceptionClient(token);
  }
}
