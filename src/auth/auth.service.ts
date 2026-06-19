import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../modules/email/email.service';
import { ConnexionDto } from './dto/connexion.dto';
import { InscriptionDto } from './dto/inscription.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async inscription(dto: InscriptionDto) {
    const entrepriseExistante = await this.prisma.entreprise.findUnique({
      where: { email: dto.emailEntreprise },
    });
    if (entrepriseExistante) {
      throw new ConflictException('Une entreprise avec cet email existe déjà.');
    }

    const motDePasseHash = await bcrypt.hash(dto.motDePasse, 12);
    const confirmationToken = uuidv4();
    const confirmationExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);

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
            actif: false,
            emailConfirme: false,
            emailConfirmationToken: confirmationToken,
            emailConfirmationExpiration: confirmationExpiration,
          },
        },
      },
      include: {
        utilisateurs: { where: { email: dto.emailAdmin } },
      },
    });

    const admin = entreprise.utilisateurs[0];

    await this.emailService.sendConfirmationEmail({
      toEmail: dto.emailAdmin,
      toName: dto.nomAdmin,
      token: confirmationToken,
    });

    return {
      message: `Un email de confirmation a été envoyé à ${dto.emailAdmin}. Vérifiez votre boîte mail pour activer votre compte.`,
      emailEnvoye: true,
    };
  }

  async confirmerEmail(token: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { emailConfirmationToken: token },
      include: { entreprise: true },
    });

    if (!utilisateur) {
      throw new BadRequestException('Lien de confirmation invalide.');
    }

    if (utilisateur.emailConfirmationExpiration && utilisateur.emailConfirmationExpiration < new Date()) {
      throw new BadRequestException('Ce lien de confirmation a expiré. Veuillez vous réinscrire.');
    }

    if (utilisateur.emailConfirme) {
      throw new BadRequestException('Cet email a déjà été confirmé.');
    }

    await this.prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: {
        emailConfirme: true,
        actif: true,
        emailConfirmationToken: null,
        emailConfirmationExpiration: null,
      },
    });

    const tokens = await this.genererTokens(
      utilisateur.id,
      utilisateur.email,
      utilisateur.entrepriseId,
      utilisateur.role,
      utilisateur.superAdmin,
    );

    return {
      message: `Bienvenue sur Sayerli, ${utilisateur.nom} ! Votre compte est maintenant activé.`,
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

  async connexion(dto: ConnexionDto) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { email: dto.email },
      include: { entreprise: true },
      // invitationToken needed for clearer error message
    });

    if (!utilisateur) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    if (!utilisateur.emailConfirme && !utilisateur.invitationToken) {
      throw new UnauthorizedException('Veuillez confirmer votre adresse email avant de vous connecter.');
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
      utilisateur.superAdmin,
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

  async demanderResetPassword(email: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({ where: { email } });

    // Always return success to avoid email enumeration
    if (!utilisateur || !utilisateur.emailConfirme) {
      return { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' };
    }

    const token = uuidv4();
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { resetPasswordToken: token, resetPasswordExpiration: expiration },
    });

    await this.emailService.sendResetPasswordEmail({
      toEmail: utilisateur.email,
      toName: utilisateur.nom,
      token,
    });

    return { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' };
  }

  async reinitialiserMotDePasse(token: string, nouveauMotDePasse: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!utilisateur) {
      throw new BadRequestException('Lien de réinitialisation invalide.');
    }

    if (utilisateur.resetPasswordExpiration && utilisateur.resetPasswordExpiration < new Date()) {
      throw new BadRequestException('Ce lien a expiré. Veuillez faire une nouvelle demande.');
    }

    const motDePasseHash = await bcrypt.hash(nouveauMotDePasse, 12);

    await this.prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: {
        motDePasseHash,
        resetPasswordToken: null,
        resetPasswordExpiration: null,
      },
    });

    return { message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.' };
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
    superAdmin = false,
  ) {
    const payload = { sub: userId, email, entrepriseId, role, superAdmin };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
