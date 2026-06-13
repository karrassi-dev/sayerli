import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PLAN_LIMITS } from '../../common/utils/plan-limits';
import * as bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateBrandingDto } from './dto/update-branding.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // ─── PROFILE ──────────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        role: true,
        langue: true,
        theme: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.utilisateur.update({
      where: { id: userId },
      data: {
        ...(dto.nom && { nom: dto.nom }),
        ...(dto.telephone !== undefined && { telephone: dto.telephone }),
      },
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        role: true,
      },
    });
    return user;
  }

  // ─── COMPANY ──────────────────────────────────────────────────────────────

  async getCompany(entrepriseId: string) {
    const company = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        adresse: true,
        ville: true,
        pays: true,
        website: true,
        ice: true,
        rc: true,
        devise: true,
        formatDate: true,
        logo: true,
        couleurPrimaire: true,
        plan: true,
        planExpiration: true,
        createdAt: true,
        titulaireCompte: true,
        banque: true,
        rib: true,
        iban: true,
        swift: true,
      },
    });
    if (!company) throw new NotFoundException('Entreprise introuvable.');
    return company;
  }

  async updateCompany(entrepriseId: string, dto: UpdateCompanyDto) {
    const data: Record<string, unknown> = {};
    if (dto.nom) data.nom = dto.nom;
    if (dto.telephone !== undefined) data.telephone = dto.telephone;
    if (dto.email) data.email = dto.email;
    if (dto.adresse !== undefined) data.adresse = dto.adresse;
    if (dto.ville !== undefined) data.ville = dto.ville;
    if (dto.pays !== undefined) data.pays = dto.pays;
    if (dto.website !== undefined) data.website = dto.website;
    if (dto.ice !== undefined) data.ice = dto.ice;
    if (dto.rc !== undefined) data.rc = dto.rc;
    if (dto.titulaireCompte !== undefined) data.titulaireCompte = dto.titulaireCompte;
    if (dto.banque !== undefined) data.banque = dto.banque;
    if (dto.rib !== undefined) data.rib = dto.rib;
    if (dto.iban !== undefined) data.iban = dto.iban;
    if (dto.swift !== undefined) data.swift = dto.swift;

    return this.prisma.entreprise.update({
      where: { id: entrepriseId },
      data,
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        adresse: true,
        ville: true,
        pays: true,
        website: true,
        ice: true,
        rc: true,
        titulaireCompte: true,
        banque: true,
        rib: true,
        iban: true,
        swift: true,
        updatedAt: true,
      },
    });
  }

  // ─── BRANDING ─────────────────────────────────────────────────────────────

  async getBranding(entrepriseId: string) {
    const company = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { logo: true, couleurPrimaire: true },
    });
    if (!company) throw new NotFoundException('Entreprise introuvable.');
    return company;
  }

  async updateBranding(entrepriseId: string, dto: UpdateBrandingDto) {
    const data: Record<string, unknown> = {};
    if (dto.couleurPrimaire) data.couleurPrimaire = dto.couleurPrimaire;

    return this.prisma.entreprise.update({
      where: { id: entrepriseId },
      data,
      select: { logo: true, couleurPrimaire: true, updatedAt: true },
    });
  }

  async uploadLogo(entrepriseId: string, file: Express.Multer.File) {
    const ALLOWED_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
    const MAX_SIZE = 2 * 1024 * 1024;

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Format non supporté. Utilisez PNG, JPG ou SVG.');
    }
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('Le fichier ne doit pas dépasser 2MB.');
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'sayerli/logos',
          public_id: `logo-${entrepriseId}`,
          overwrite: true,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      ).end(file.buffer);
    });

    const company = await this.prisma.entreprise.update({
      where: { id: entrepriseId },
      data: { logo: result.secure_url },
      select: { logo: true, updatedAt: true },
    });

    return company;
  }

  // ─── PREFERENCES ──────────────────────────────────────────────────────────

  async getPreferences(userId: string, entrepriseId: string) {
    const [user, company] = await Promise.all([
      this.prisma.utilisateur.findUnique({
        where: { id: userId },
        select: { langue: true, theme: true },
      }),
      this.prisma.entreprise.findUnique({
        where: { id: entrepriseId },
        select: { devise: true, formatDate: true },
      }),
    ]);
    if (!user || !company) throw new NotFoundException('Données introuvables.');
    return {
      langue: user.langue ?? 'fr',
      theme: user.theme ?? 'system',
      devise: company.devise ?? 'MAD',
      formatDate: company.formatDate ?? 'DD/MM/YYYY',
    };
  }

  async updatePreferences(userId: string, entrepriseId: string, role: string, dto: UpdatePreferencesDto) {
    if ((dto.devise || dto.formatDate) && role !== 'ADMIN') {
      throw new ForbiddenException('Seul un administrateur peut modifier la devise et le format de date.');
    }

    const userUpdate: Record<string, unknown> = {};
    const companyUpdate: Record<string, unknown> = {};

    if (dto.langue) userUpdate.langue = dto.langue;
    if (dto.theme) userUpdate.theme = dto.theme;
    if (dto.devise) companyUpdate.devise = dto.devise;
    if (dto.formatDate) companyUpdate.formatDate = dto.formatDate;

    await Promise.all([
      Object.keys(userUpdate).length > 0
        ? this.prisma.utilisateur.update({ where: { id: userId }, data: userUpdate })
        : Promise.resolve(),
      Object.keys(companyUpdate).length > 0
        ? this.prisma.entreprise.update({ where: { id: entrepriseId }, data: companyUpdate })
        : Promise.resolve(),
    ]);

    return this.getPreferences(userId, entrepriseId);
  }

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────

  async getNotifications(userId: string) {
    const prefs = await this.prisma.preferencesNotification.findUnique({
      where: { utilisateurId: userId },
    });

    if (!prefs) {
      return this.prisma.preferencesNotification.create({
        data: { utilisateurId: userId },
      });
    }
    return prefs;
  }

  async updateNotifications(userId: string, dto: UpdateNotificationsDto) {
    return this.prisma.preferencesNotification.upsert({
      where: { utilisateurId: userId },
      update: { ...dto },
      create: { utilisateurId: userId, ...dto },
      select: {
        emailNotifications: true,
        notificationsDevis: true,
        notificationsFactures: true,
        notificationsPaiements: true,
        notificationsSysteme: true,
        inAppDevis: true,
        inAppFactures: true,
        inAppPaiements: true,
        inAppSysteme: true,
      },
    });
  }

  // ─── SECURITY ─────────────────────────────────────────────────────────────

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.nouveauMotDePasse !== dto.confirmationMotDePasse) {
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }

    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { motDePasseHash: true },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const valide = await bcrypt.compare(dto.motDePasseActuel, user.motDePasseHash);
    if (!valide) {
      throw new BadRequestException('Le mot de passe actuel est incorrect.');
    }

    const hash = await bcrypt.hash(dto.nouveauMotDePasse, 12);
    await this.prisma.utilisateur.update({
      where: { id: userId },
      data: { motDePasseHash: hash },
    });

    return { message: 'Mot de passe mis à jour avec succès.' };
  }

  // ─── BILLING ─────────────────────────────────────────────────────────────

  async getBilling(entrepriseId: string) {
    const now = new Date();
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);

    const [company, clientsActifs, utilisateursCount, devisCeMois] = await Promise.all([
      this.prisma.entreprise.findUnique({
        where: { id: entrepriseId },
        select: { plan: true, planDebut: true, planExpiration: true, createdAt: true },
      }),
      this.prisma.client.count({ where: { entrepriseId, actif: true } }),
      this.prisma.utilisateur.count({ where: { entrepriseId } }),
      this.prisma.devis.count({ where: { entrepriseId, createdAt: { gte: debutMois } } }),
    ]);

    if (!company) throw new NotFoundException('Entreprise introuvable.');

    const limits = PLAN_LIMITS[company.plan];
    const planDebut = company.planDebut ?? company.createdAt;

    let joursRestants: number | null = null;
    if (company.planExpiration) {
      const diff = company.planExpiration.getTime() - now.getTime();
      joursRestants = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    return {
      plan: company.plan,
      planDebut,
      planExpiration: company.planExpiration,
      joursRestants,
      usage: {
        clients:     { actuel: clientsActifs,    limite: limits.clients },
        utilisateurs:{ actuel: utilisateursCount, limite: limits.utilisateurs },
        devisCeMois: { actuel: devisCeMois,       limite: limits.devisParMois },
      },
    };
  }
}
