import {
  Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException,
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

    // Find or create CompteGlobal for the admin email
    let compteGlobal = await this.prisma.compteGlobal.findUnique({ where: { email: dto.emailAdmin } });
    if (!compteGlobal) {
      compteGlobal = await this.prisma.compteGlobal.create({
        data: { email: dto.emailAdmin, motDePasseHash },
      });
    }

    const entreprise = await this.prisma.entreprise.create({
      data: {
        nom: dto.nomEntreprise,
        email: dto.emailEntreprise,
        telephone: dto.telephoneEntreprise,
        adresse: dto.adresseEntreprise,
        devise: 'MAD',
        typeCompte: dto.typeCompte ?? 'pme',
        utilisateurs: {
          create: {
            nom: dto.nomAdmin,
            email: dto.emailAdmin,
            motDePasseHash,
            role: 'PROPRIETAIRE',
            actif: false,
            emailConfirme: false,
            emailConfirmationToken: confirmationToken,
            emailConfirmationExpiration: confirmationExpiration,
            compteGlobalId: compteGlobal.id,
          },
        },
      },
      include: { utilisateurs: { where: { email: dto.emailAdmin } } },
    });

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

    if (!utilisateur) throw new BadRequestException('Lien de confirmation invalide.');
    if (utilisateur.emailConfirmationExpiration && utilisateur.emailConfirmationExpiration < new Date()) {
      throw new BadRequestException('Ce lien de confirmation a expiré. Veuillez vous réinscrire.');
    }
    if (utilisateur.emailConfirme) throw new BadRequestException('Cet email a déjà été confirmé.');

    // Ensure CompteGlobal exists and is linked
    if (!utilisateur.compteGlobalId && utilisateur.motDePasseHash) {
      let compte = await this.prisma.compteGlobal.findUnique({ where: { email: utilisateur.email } });
      if (!compte) {
        compte = await this.prisma.compteGlobal.create({
          data: { email: utilisateur.email, motDePasseHash: utilisateur.motDePasseHash },
        });
      }
      await this.prisma.utilisateur.update({
        where: { id: utilisateur.id },
        data: { compteGlobalId: compte.id },
      });
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
      utilisateur.id, utilisateur.email, utilisateur.entrepriseId,
      utilisateur.role, utilisateur.superAdmin,
    );

    return {
      message: `Bienvenue sur Sayerli, ${utilisateur.nom} ! Votre compte est maintenant activé.`,
      utilisateur: { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role },
      entreprise: {
        id: utilisateur.entreprise.id, nom: utilisateur.entreprise.nom,
        email: utilisateur.entreprise.email, devise: utilisateur.entreprise.devise, plan: utilisateur.entreprise.plan,
      },
      ...tokens,
    };
  }

  async connexion(dto: ConnexionDto) {
    // ── Path 1: CompteGlobal (new multi-company flow) ────────────────────────
    const compteGlobal = await this.prisma.compteGlobal.findUnique({
      where: { email: dto.email },
      include: {
        utilisateurs: {
          where: { actif: true },
          include: { entreprise: true },
        },
      },
    });

    if (compteGlobal) {
      if (!compteGlobal.motDePasseHash) {
        throw new UnauthorizedException('Veuillez d\'abord accepter votre invitation.');
      }
      const valid = await bcrypt.compare(dto.motDePasse, compteGlobal.motDePasseHash);
      if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect.');

      const memberships = compteGlobal.utilisateurs;
      if (memberships.length === 0) {
        throw new UnauthorizedException('Votre compte a été désactivé. Contactez l\'administrateur.');
      }

      // Update last access for all memberships in background
      this.prisma.utilisateur.updateMany({
        where: { compteGlobalId: compteGlobal.id, actif: true },
        data: { dernierAcces: new Date() },
      }).catch(() => {});

      if (memberships.length === 1) {
        const u = memberships[0];
        const tokens = await this.genererTokens(u.id, u.email, u.entrepriseId, u.role, u.superAdmin);
        return {
          utilisateur: { id: u.id, nom: u.nom, prenom: u.prenom, email: u.email, role: u.role },
          entreprise: {
            id: u.entreprise.id, nom: u.entreprise.nom, email: u.entreprise.email,
            devise: u.entreprise.devise, plan: u.entreprise.plan,
          },
          companies: this.buildCompaniesList(memberships),
          ...tokens,
        };
      }

      // Multiple companies → return selection token
      const selectToken = await this.jwtService.signAsync(
        { sub: compteGlobal.id, type: 'select', email: compteGlobal.email },
        { expiresIn: '5m' },
      );

      return {
        requiresCompanySelect: true,
        selectToken,
        companies: this.buildCompaniesList(memberships),
      };
    }

    // ── Path 2: Legacy single-company fallback ───────────────────────────────
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { email: dto.email },
      include: { entreprise: true },
    });

    if (!utilisateur) throw new UnauthorizedException('Email ou mot de passe incorrect.');

    if (!utilisateur.emailConfirme && !utilisateur.invitationToken) {
      throw new UnauthorizedException('Veuillez confirmer votre adresse email avant de vous connecter.');
    }
    if (!utilisateur.actif) {
      if (utilisateur.invitationToken) throw new UnauthorizedException('Vous devez d\'abord accepter votre invitation. Vérifiez votre email.');
      throw new UnauthorizedException('Votre compte a été désactivé. Contactez l\'administrateur.');
    }
    if (!utilisateur.motDePasseHash) throw new UnauthorizedException('Vous devez d\'abord accepter votre invitation. Vérifiez votre email.');

    const valid = await bcrypt.compare(dto.motDePasse, utilisateur.motDePasseHash);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect.');

    await this.prisma.utilisateur.update({ where: { id: utilisateur.id }, data: { dernierAcces: new Date() } });

    // Lazy migration: create CompteGlobal and link all utilisateurs with this email
    this.migerVerCompteGlobal(utilisateur.email, utilisateur.motDePasseHash).catch(() => {});

    const tokens = await this.genererTokens(
      utilisateur.id, utilisateur.email, utilisateur.entrepriseId, utilisateur.role, utilisateur.superAdmin,
    );

    return {
      utilisateur: { id: utilisateur.id, nom: utilisateur.nom, prenom: utilisateur.prenom, email: utilisateur.email, role: utilisateur.role },
      entreprise: {
        id: utilisateur.entreprise.id, nom: utilisateur.entreprise.nom,
        email: utilisateur.entreprise.email, devise: utilisateur.entreprise.devise, plan: utilisateur.entreprise.plan,
      },
      companies: [{ utilisateurId: utilisateur.id, entrepriseId: utilisateur.entrepriseId, nom: utilisateur.entreprise.nom, plan: utilisateur.entreprise.plan, role: utilisateur.role }],
      ...tokens,
    };
  }

  async selectionnerEntreprise(selectToken: string, utilisateurId: string) {
    let payload: { sub: string; type: string; email: string };
    try {
      payload = this.jwtService.verify(selectToken);
    } catch {
      throw new UnauthorizedException('Session expirée. Veuillez vous reconnecter.');
    }
    if (payload.type !== 'select') throw new UnauthorizedException('Token invalide.');

    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { id: utilisateurId, compteGlobal: { id: payload.sub }, actif: true },
      include: { entreprise: true },
    });

    if (!utilisateur) throw new UnauthorizedException('Sélection invalide.');

    await this.prisma.utilisateur.update({ where: { id: utilisateur.id }, data: { dernierAcces: new Date() } });

    // Get all companies for this account to return
    const allMemberships = await this.prisma.utilisateur.findMany({
      where: { compteGlobalId: payload.sub, actif: true },
      include: { entreprise: true },
    });

    const tokens = await this.genererTokens(utilisateur.id, utilisateur.email, utilisateur.entrepriseId, utilisateur.role, utilisateur.superAdmin);
    return {
      utilisateur: { id: utilisateur.id, nom: utilisateur.nom, prenom: utilisateur.prenom, email: utilisateur.email, role: utilisateur.role },
      entreprise: {
        id: utilisateur.entreprise.id, nom: utilisateur.entreprise.nom,
        email: utilisateur.entreprise.email, devise: utilisateur.entreprise.devise, plan: utilisateur.entreprise.plan,
      },
      companies: this.buildCompaniesList(allMemberships),
      ...tokens,
    };
  }

  async mesEntreprises(utilisateurId: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({ where: { id: utilisateurId } });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable.');

    const membres = await this.prisma.utilisateur.findMany({
      where: { email: utilisateur.email, actif: true },
      include: { entreprise: true },
    });

    return this.buildCompaniesList(membres);
  }

  async changerEntreprise(currentUtilisateurId: string, targetUtilisateurId: string) {
    const current = await this.prisma.utilisateur.findUnique({ where: { id: currentUtilisateurId } });
    if (!current) throw new UnauthorizedException();

    const target = await this.prisma.utilisateur.findFirst({
      where: { id: targetUtilisateurId, email: current.email, actif: true },
      include: { entreprise: true },
    });
    if (!target) throw new UnauthorizedException('Sélection invalide.');

    await this.prisma.utilisateur.update({ where: { id: target.id }, data: { dernierAcces: new Date() } });

    const tokens = await this.genererTokens(target.id, target.email, target.entrepriseId, target.role, target.superAdmin);
    return {
      utilisateur: { id: target.id, nom: target.nom, prenom: target.prenom, email: target.email, role: target.role },
      entreprise: {
        id: target.entreprise.id, nom: target.entreprise.nom,
        email: target.entreprise.email, devise: target.entreprise.devise, plan: target.entreprise.plan,
      },
      ...tokens,
    };
  }

  async demanderResetPassword(email: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({ where: { email } });
    if (!utilisateur || !utilisateur.emailConfirme) {
      return { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' };
    }

    const token = uuidv4();
    const expiration = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { resetPasswordToken: token, resetPasswordExpiration: expiration },
    });

    await this.emailService.sendResetPasswordEmail({ toEmail: utilisateur.email, toName: utilisateur.nom, token });
    return { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' };
  }

  async reinitialiserMotDePasse(token: string, nouveauMotDePasse: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({ where: { resetPasswordToken: token } });
    if (!utilisateur) throw new BadRequestException('Lien de réinitialisation invalide.');
    if (utilisateur.resetPasswordExpiration && utilisateur.resetPasswordExpiration < new Date()) {
      throw new BadRequestException('Ce lien a expiré. Veuillez faire une nouvelle demande.');
    }

    const motDePasseHash = await bcrypt.hash(nouveauMotDePasse, 12);

    await this.prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { motDePasseHash, resetPasswordToken: null, resetPasswordExpiration: null },
    });

    // Also update CompteGlobal if linked
    if (utilisateur.compteGlobalId) {
      await this.prisma.compteGlobal.update({
        where: { id: utilisateur.compteGlobalId },
        data: { motDePasseHash },
      });
    }

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

  private buildCompaniesList(membres: any[]) {
    return membres.map(u => ({
      utilisateurId: u.id,
      entrepriseId: u.entrepriseId,
      nom: u.entreprise.nom,
      plan: u.entreprise.plan,
      role: u.role,
    }));
  }

  private async migerVerCompteGlobal(email: string, motDePasseHash: string) {
    try {
      const compte = await this.prisma.compteGlobal.create({
        data: { email, motDePasseHash },
      });
      await this.prisma.utilisateur.updateMany({
        where: { email, compteGlobalId: null },
        data: { compteGlobalId: compte.id },
      });
    } catch {
      // Already exists (concurrent request or existing) — try to link anyway
      const compte = await this.prisma.compteGlobal.findUnique({ where: { email } });
      if (compte) {
        await this.prisma.utilisateur.updateMany({
          where: { email, compteGlobalId: null },
          data: { compteGlobalId: compte.id },
        }).catch(() => {});
      }
    }
  }

  private async genererTokens(userId: string, email: string, entrepriseId: string, role: string, superAdmin = false) {
    const payload = { sub: userId, email, entrepriseId, role, superAdmin };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
