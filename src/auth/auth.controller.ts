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
  @Get('confirmer-email/:token')
  async confirmerEmail(@Param('token') token: string) {
    return this.authService.confirmerEmail(token);
  }

  @Get('profil')
  async profil(@UtilisateurCourant('id') userId: string) {
    return this.authService.profil(userId);
  }
}
