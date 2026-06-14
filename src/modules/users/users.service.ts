import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { RoleType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreerUtilisateurDto } from './dto/creer-utilisateur.dto';
import { ModifierUtilisateurDto } from './dto/modifier-utilisateur.dto';
import { AccepterInvitationDto } from './dto/accepter-invitation.dto';
import { EmailService } from '../email/email.service';
import { PLAN_LIMITS, verifierLimite } from '../../common/utils/plan-limits';

function computeStatut(actif: boolean, invitationToken: string | null): string {
  if (actif) return 'ACTIF';
  if (invitationToken) return 'EN_ATTENTE';
  return 'DESACTIVE';
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async listerUtilisateurs(entrepriseId: string, recherche?: string) {
    const utilisateurs = await this.prisma.utilisateur.findMany({
      where: {
        entrepriseId,
        ...(recherche && {
          OR: [
            { nom: { contains: recherche, mode: 'insensitive' } },
            { prenom: { contains: recherche, mode: 'insensitive' } },
            { email: { contains: recherche, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        telephone: true,
        role: true,
        actif: true,
        invitationToken: true,
        dernierAcces: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return utilisateurs.map(u => ({
      id: u.id,
      prenom: u.prenom,
      nom: u.nom,
      nomComplet: u.prenom ? `${u.prenom} ${u.nom}` : u.nom,
      email: u.email,
      telephone: u.telephone,
      role: u.role,
      statut: computeStatut(u.actif, u.invitationToken),
      dernierAcces: u.dernierAcces,
      createdAt: u.createdAt,
    }));
  }

  async obtenirUtilisateur(id: string, entrepriseId: string) {
    const u = await this.prisma.utilisateur.findFirst({
      where: { id, entrepriseId },
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        telephone: true,
        role: true,
        actif: true,
        invitationToken: true,
        dernierAcces: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!u) throw new NotFoundException('Utilisateur introuvable.');

    return {
      id: u.id,
      prenom: u.prenom,
      nom: u.nom,
      nomComplet: u.prenom ? `${u.prenom} ${u.nom}` : u.nom,
      email: u.email,
      telephone: u.telephone,
      role: u.role,
      statut: computeStatut(u.actif, u.invitationToken),
      dernierAcces: u.dernierAcces,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }

  async inviterUtilisateur(dto: CreerUtilisateurDto, entrepriseId: string) {
    const [entreprise, actuelUtilisateurs] = await Promise.all([
      this.prisma.entreprise.findUnique({ where: { id: entrepriseId }, select: { plan: true, nom: true } }),
      this.prisma.utilisateur.count({ where: { entrepriseId } }),
    ]);
    if (!entreprise) throw new NotFoundException('Entreprise introuvable.');
    verifierLimite('utilisateurs', actuelUtilisateurs, PLAN_LIMITS[entreprise.plan].utilisateurs);

    const existant = await this.prisma.utilisateur.findFirst({
      where: { email: dto.email, entrepriseId },
    });
    if (existant) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà dans votre entreprise.');
    }

    const token = randomUUID();
    const expiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const utilisateur = await this.prisma.utilisateur.create({
      data: {
        prenom: dto.prenom,
        nom: dto.nom,
        email: dto.email,
        telephone: dto.telephone,
        motDePasseHash: null,
        role: dto.role,
        actif: false,
        invitationToken: token,
        invitationTokenExpiration: expiration,
        entrepriseId,
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        telephone: true,
        role: true,
        actif: true,
        invitationToken: true,
        createdAt: true,
      },
    });

    const nomComplet = utilisateur.prenom
      ? `${utilisateur.prenom} ${utilisateur.nom}`
      : utilisateur.nom;

    // Send invitation email (non-blocking — errors are logged, not thrown)
    this.email.sendInvitation({
      toEmail: utilisateur.email,
      toName: nomComplet,
      entrepriseName: entreprise?.nom ?? 'Sayerli',
      role: utilisateur.role,
      token,
    });

    return {
      ...utilisateur,
      nomComplet,
      statut: 'EN_ATTENTE',
      invitationLink: `/invitation/${token}`,
    };
  }

  async renvoyerInvitation(id: string, entrepriseId: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { id, entrepriseId },
      select: { id: true, prenom: true, nom: true, email: true, role: true, actif: true, invitationToken: true },
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable.');
    if (utilisateur.actif) throw new BadRequestException('Cet utilisateur a déjà accepté son invitation.');

    const token = randomUUID();
    const expiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.utilisateur.update({
      where: { id },
      data: { invitationToken: token, invitationTokenExpiration: expiration },
    });

    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { nom: true },
    });

    const nomComplet = utilisateur.prenom
      ? `${utilisateur.prenom} ${utilisateur.nom}`
      : utilisateur.nom;

    this.email.sendInvitation({
      toEmail: utilisateur.email,
      toName: nomComplet,
      entrepriseName: entreprise?.nom ?? 'Sayerli',
      role: utilisateur.role,
      token,
    });

    return { message: 'Invitation renvoyée avec succès.' };
  }

  async modifierUtilisateur(id: string, dto: ModifierUtilisateurDto, entrepriseId: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { id, entrepriseId },
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable.');

    const updated = await this.prisma.utilisateur.update({
      where: { id },
      data: {
        ...(dto.prenom !== undefined && { prenom: dto.prenom }),
        ...(dto.nom !== undefined && { nom: dto.nom }),
        ...(dto.telephone !== undefined && { telephone: dto.telephone }),
        ...(dto.role !== undefined && { role: dto.role }),
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        telephone: true,
        role: true,
        actif: true,
        invitationToken: true,
        dernierAcces: true,
        updatedAt: true,
      },
    });

    return {
      ...updated,
      nomComplet: updated.prenom ? `${updated.prenom} ${updated.nom}` : updated.nom,
      statut: computeStatut(updated.actif, updated.invitationToken),
    };
  }

  async desactiverUtilisateur(id: string, entrepriseId: string, demandeurId: string) {
    if (id === demandeurId) {
      throw new ForbiddenException('Vous ne pouvez pas désactiver votre propre compte.');
    }
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { id, entrepriseId },
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable.');
    if (!utilisateur.actif) {
      throw new BadRequestException('Ce compte est déjà désactivé.');
    }

    if (utilisateur.role === RoleType.ADMIN) {
      const adminActifsCount = await this.prisma.utilisateur.count({
        where: { entrepriseId, role: RoleType.ADMIN, actif: true },
      });
      if (adminActifsCount <= 1) {
        throw new ForbiddenException('Impossible de désactiver le dernier administrateur actif.');
      }
    }

    await this.prisma.utilisateur.update({
      where: { id },
      data: { actif: false },
    });

    return { message: 'Compte désactivé avec succès.' };
  }

  async activerUtilisateur(id: string, entrepriseId: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { id, entrepriseId },
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable.');
    if (utilisateur.actif) {
      throw new BadRequestException('Ce compte est déjà actif.');
    }
    if (!utilisateur.motDePasseHash) {
      throw new BadRequestException('Ce membre doit d\'abord accepter son invitation.');
    }

    await this.prisma.utilisateur.update({
      where: { id },
      data: { actif: true },
    });

    return { message: 'Compte réactivé avec succès.' };
  }

  async supprimerUtilisateur(id: string, entrepriseId: string, demandeurId: string) {
    if (id === demandeurId) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer votre propre compte.');
    }
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { id, entrepriseId },
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable.');

    if (utilisateur.role === RoleType.ADMIN) {
      const adminCount = await this.prisma.utilisateur.count({
        where: { entrepriseId, role: RoleType.ADMIN },
      });
      if (adminCount <= 1) {
        throw new ForbiddenException('Impossible de supprimer le seul administrateur. Assignez ce rôle à un autre membre d\'abord.');
      }
    }

    await this.prisma.utilisateur.delete({ where: { id } });
    return { message: 'Membre retiré avec succès.' };
  }

  async accepterInvitation(token: string, dto: AccepterInvitationDto) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { invitationToken: token },
    });
    if (!utilisateur) {
      throw new NotFoundException('Lien d\'invitation invalide ou déjà utilisé.');
    }
    if (utilisateur.invitationTokenExpiration && utilisateur.invitationTokenExpiration < new Date()) {
      throw new BadRequestException('Ce lien d\'invitation a expiré. Demandez une nouvelle invitation à votre administrateur.');
    }

    const hash = await bcrypt.hash(dto.motDePasse, 12);
    await this.prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: {
        motDePasseHash: hash,
        actif: true,
        invitationToken: null,
        invitationTokenExpiration: null,
      },
    });

    return { message: 'Votre compte a été activé. Vous pouvez maintenant vous connecter.' };
  }
}
