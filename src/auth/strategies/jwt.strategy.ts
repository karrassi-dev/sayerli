import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  entrepriseId: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: payload.sub },
      include: { entreprise: true },
    });

    if (!utilisateur || !utilisateur.actif) {
      throw new UnauthorizedException('Session expirée. Veuillez vous reconnecter.');
    }

    return {
      id: utilisateur.id,
      email: utilisateur.email,
      nom: utilisateur.nom,
      role: utilisateur.role,
      entrepriseId: utilisateur.entrepriseId,
      entreprise: utilisateur.entreprise,
    };
  }
}
