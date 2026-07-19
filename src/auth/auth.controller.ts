import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { ConnexionDto } from './dto/connexion.dto';
import { InscriptionDto } from './dto/inscription.dto';
import { Public } from '../common/decorators/public.decorator';
import { UtilisateurCourant } from '../common/decorators/utilisateur-courant.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('inscription')
  async inscription(@Body() dto: InscriptionDto) {
    return this.authService.inscription(dto);
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('connexion')
  @HttpCode(HttpStatus.OK)
  async connexion(@Body() dto: ConnexionDto) {
    return this.authService.connexion(dto);
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post('selectionner-entreprise')
  @HttpCode(HttpStatus.OK)
  async selectionnerEntreprise(
    @Body('selectToken') selectToken: string,
    @Body('utilisateurId') utilisateurId: string,
  ) {
    return this.authService.selectionnerEntreprise(selectToken, utilisateurId);
  }

  @Get('mes-entreprises')
  async mesEntreprises(@UtilisateurCourant('id') userId: string) {
    return this.authService.mesEntreprises(userId);
  }

  @Post('changer-entreprise')
  @HttpCode(HttpStatus.OK)
  async changerEntreprise(
    @UtilisateurCourant('id') currentId: string,
    @Body('utilisateurId') targetId: string,
  ) {
    return this.authService.changerEntreprise(currentId, targetId);
  }

  @Public()
  @Get('confirmer-email/:token')
  async confirmerEmail(@Param('token') token: string) {
    return this.authService.confirmerEmail(token);
  }

  @Public()
  @Post('mot-de-passe-oublie')
  @HttpCode(HttpStatus.OK)
  async motDePasseOublie(@Body('email') email: string) {
    return this.authService.demanderResetPassword(email);
  }

  @Public()
  @Post('reinitialiser-mot-de-passe/:token')
  @HttpCode(HttpStatus.OK)
  async reinitialiserMotDePasse(@Param('token') token: string, @Body('motDePasse') motDePasse: string) {
    return this.authService.reinitialiserMotDePasse(token, motDePasse);
  }

  @Get('profil')
  async profil(@UtilisateurCourant('id') userId: string) {
    return this.authService.profil(userId);
  }
}
