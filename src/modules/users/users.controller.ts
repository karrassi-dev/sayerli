import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { UsersService } from './users.service';
import { CreerUtilisateurDto } from './dto/creer-utilisateur.dto';
import { ModifierUtilisateurDto } from './dto/modifier-utilisateur.dto';
import { AccepterInvitationDto } from './dto/accepter-invitation.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('equipe')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE)
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.usersService.listerUtilisateurs(entrepriseId, recherche);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.PROPRIETAIRE)
  async obtenir(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.usersService.obtenirUtilisateur(id, entrepriseId);
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.PROPRIETAIRE)
  async inviter(
    @Body() dto: CreerUtilisateurDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.usersService.inviterUtilisateur(dto, entrepriseId);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN, RoleType.PROPRIETAIRE)
  async modifier(
    @Param('id') id: string,
    @Body() dto: ModifierUtilisateurDto,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.usersService.modifierUtilisateur(id, dto, entrepriseId);
  }

  @Post(':id/reinviter')
  @Roles(RoleType.ADMIN, RoleType.PROPRIETAIRE)
  async reinviter(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.usersService.renvoyerInvitation(id, entrepriseId);
  }

  @Patch(':id/desactiver')
  @Roles(RoleType.ADMIN, RoleType.PROPRIETAIRE)
  async desactiver(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') demandeurId: string,
  ) {
    return this.usersService.desactiverUtilisateur(id, entrepriseId, demandeurId);
  }

  @Patch(':id/activer')
  @Roles(RoleType.ADMIN, RoleType.PROPRIETAIRE)
  async activer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.usersService.activerUtilisateur(id, entrepriseId);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.PROPRIETAIRE)
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('id') demandeurId: string,
  ) {
    return this.usersService.supprimerUtilisateur(id, entrepriseId, demandeurId);
  }
}

@Controller('invitation')
export class InvitationController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post(':token')
  async accepter(
    @Param('token') token: string,
    @Body() dto: AccepterInvitationDto,
  ) {
    return this.usersService.accepterInvitation(token, dto);
  }
}
