import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { CatalogueService } from './catalogue.service';
import { CreerProduitDto } from './dto/creer-produit.dto';
import { ModifierProduitDto } from './dto/modifier-produit.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('catalogue')
export class CatalogueController {
  constructor(private service: CatalogueService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE, RoleType.COMMERCIAL_PROPRE, RoleType.ASSISTANT)
  @Permission('catalogue.read')
  lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('recherche') recherche?: string,
    @Query('type') type?: string,
  ) {
    return this.service.lister(entrepriseId, recherche, type);
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE)
  @Permission('catalogue.manage')
  creer(
    @Body() dto: CreerProduitDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.service.creer(dto, entrepriseId);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE)
  @Permission('catalogue.manage')
  modifier(
    @Param('id') id: string,
    @Body() dto: ModifierProduitDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.service.modifier(id, dto, entrepriseId);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.PROPRIETAIRE)
  @Permission('catalogue.manage')
  supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.service.supprimer(id, entrepriseId);
  }
}
