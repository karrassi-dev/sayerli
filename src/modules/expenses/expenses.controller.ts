import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, Res, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RoleType, CategorieDepense } from '@prisma/client';
import { ExpensesService } from './expenses.service';
import { CreerDepenseDto } from './dto/creer-depense.dto';
import { ModifierDepenseDto } from './dto/modifier-depense.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

const ALL_ROLES = [
  RoleType.ADMIN, RoleType.MANAGER, RoleType.COMMERCIAL, RoleType.COMPTABLE,
  RoleType.PROPRIETAIRE, RoleType.DAF, RoleType.COMPTABLE_EXTERNE,
  RoleType.RESPONSABLE_RECOUVREMENT, RoleType.CAISSIER, RoleType.COMMERCIAL_PROPRE,
  RoleType.ASSISTANT, RoleType.ASSOCIE,
];

const EDIT_ROLES = [
  RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE,
  RoleType.DAF, RoleType.COMPTABLE, RoleType.ASSISTANT,
];

@Controller('expenses')
export class ExpensesController {
  constructor(private service: ExpensesService) {}

  @Post('upload-url')
  @Roles(...ALL_ROLES)
  async obtenirUrlUpload(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.service.obtenirUrlUpload(entrepriseId);
  }

  @Get('stockage')
  @Roles(...ALL_ROLES)
  async stockage(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.service.obtenirUsageStockage(entrepriseId);
  }

  @Get('export')
  @Roles(...EDIT_ROLES)
  async exporter(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('categorie') categorie?: CategorieDepense,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
    @Res() res?: Response,
  ) {
    const buffer = await this.service.exporter(entrepriseId, categorie, dateDebut, dateFin);
    const date = new Date().toISOString().slice(0, 10);
    res!.status(HttpStatus.OK)
      .set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="depenses-${date}.xlsx"`,
        'Content-Length': buffer.byteLength,
      })
      .end(Buffer.from(buffer));
  }

  @Get()
  @Roles(...ALL_ROLES)
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('categorie') categorie?: CategorieDepense,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.service.lister(entrepriseId, categorie, dateDebut, dateFin, recherche);
  }

  @Get(':id')
  @Roles(...ALL_ROLES)
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.service.obtenir(id, entrepriseId);
  }

  @Post()
  @Roles(...EDIT_ROLES)
  async creer(
    @Body() dto: CreerDepenseDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.creer(dto, entrepriseId, userId, userNom);
  }

  @Put(':id')
  @Roles(...EDIT_ROLES)
  async modifier(
    @Param('id') id: string,
    @Body() dto: ModifierDepenseDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.modifier(id, dto, entrepriseId, userId, userNom);
  }

  @Delete(':id')
  @Roles(...EDIT_ROLES)
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('nom') userNom: string,
  ) {
    return this.service.supprimer(id, entrepriseId, userId, userNom);
  }
}
