import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ConnexionDto } from './dto/connexion.dto';
import { InscriptionDto } from './dto/inscription.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async inscription(dto: InscriptionDto) {
    const entrepriseExistante = await this.prisma.entreprise.findUnique({
      where: { email: dto.emailEntreprise },
    });
    if (entrepriseExistante) {
      throw new ConflictException('Une entreprise avec cet email existe déjà.');
    }

    const motDePasseHash = await bcrypt.hash(dto.motDePasse, 12);

    const entreprise = await this.prisma.entreprise.create({
      data: {
        nom: dto.nomEntreprise,
        email: dto.emailEntreprise,
        telephone: dto.telephoneEntreprise,
        adresse: dto.adresseEntreprise,
        devise: 'MAD',
        utilisateurs: {
          create: {
            nom: dto.nomAdmin,
            email: dto.emailAdmin,
            motDePasseHash,
            role: 'ADMIN',
          },
        },
      },
      include: {
        utilisateurs: {
          where: { email: dto.emailAdmin },
        },
      },
    });

    const admin = entreprise.utilisateurs[0];
    const tokens = await this.genererTokens(admin.id, admin.email, entreprise.id, admin.role);

    return {
      message: `Bienvenue sur Sayerli, ${admin.nom} ! Votre compte a été créé avec succès.`,
      utilisateur: {
        id: admin.id,
        nom: admin.nom,
        email: admin.email,
        role: admin.role,
      },
      entreprise: {
        id: entreprise.id,
        nom: entreprise.nom,
        email: entreprise.email,
        devise: entreprise.devise,
        plan: entreprise.plan,
      },
      ...tokens,
    };
  }

  async connexion(dto: ConnexionDto) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { email: dto.email },
      include: { entreprise: true },
      // invitationToken needed for clearer error message
    });

    if (!utilisateur) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    if (!utilisateur.actif) {
      if (utilisateur.invitationToken) {
        throw new UnauthorizedException('Vous devez d\'abord accepter votre invitation. Vérifiez votre email.');
      }
      throw new UnauthorizedException('Votre compte a été désactivé. Contactez l\'administrateur.');
    }

    if (!utilisateur.motDePasseHash) {
      throw new UnauthorizedException('Vous devez d\'abord accepter votre invitation. Vérifiez votre email.');
    }

    const motDePasseValide = await bcrypt.compare(dto.motDePasse, utilisateur.motDePasseHash);
    if (!motDePasseValide) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    await this.prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { dernierAcces: new Date() },
    });

    const tokens = await this.genererTokens(
      utilisateur.id,
      utilisateur.email,
      utilisateur.entrepriseId,
      utilisateur.role,
    );

    return {
      message: `Bon retour, ${utilisateur.nom} !`,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
      entreprise: {
        id: utilisateur.entreprise.id,
        nom: utilisateur.entreprise.nom,
        email: utilisateur.entreprise.email,
        devise: utilisateur.entreprise.devise,
        plan: utilisateur.entreprise.plan,
      },
      ...tokens,
    };
  }

  async profil(utilisateurId: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: { entreprise: true },
    });
    if (!utilisateur) throw new UnauthorizedException('Utilisateur introuvable.');

    const { motDePasseHash, ...profil } = utilisateur;
    return profil;
  }

  private async genererTokens(
    userId: string,
    email: string,
    entrepriseId: string,
    role: string,
  ) {
    const payload = { sub: userId, email, entrepriseId, role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
