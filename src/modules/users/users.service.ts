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
import { LogsService } from '../logs/logs.service';
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
    private logs: LogsService,
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
        permissionsRetirees: true,
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
      permissionsRetirees: u.permissionsRetirees,
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

  async inviterUtilisateur(dto: CreerUtilisateurDto, entrepriseId: string, acteurId = '', acteurNom = '') {
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

    // Check if invitee already has a CompteGlobal (existing Sayerli user from another company)
    const compteExistant = await this.prisma.compteGlobal.findUnique({ where: { email: dto.email } });

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
        permissionsRetirees: dto.permissionsRetirees ?? [],
        ...(compteExistant && { compteGlobalId: compteExistant.id }),
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

    if (compteExistant) {
      this.email.sendJoinCompanyInvitation({
        toEmail: utilisateur.email,
        toName: nomComplet,
        entrepriseName: entreprise?.nom ?? 'Sayerli',
        role: utilisateur.role,
        token,
      });
    } else {
      this.email.sendInvitation({
        toEmail: utilisateur.email,
        toName: nomComplet,
        entrepriseName: entreprise?.nom ?? 'Sayerli',
        role: utilisateur.role,
        token,
      });
    }

    if (acteurId) this.logs.log({ entrepriseId, userId: acteurId, userNom: acteurNom, action: 'MEMBRE_INVITE', entityType: 'MEMBRE', entityId: utilisateur.id, entityRef: nomComplet, metadata: { role: utilisateur.role } });
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

  async modifierUtilisateur(id: string, dto: ModifierUtilisateurDto, entrepriseId: string, acteurId = '', acteurNom = '') {
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
        ...(dto.permissionsRetirees !== undefined && { permissionsRetirees: dto.permissionsRetirees }),
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
        permissionsRetirees: true,
      },
    });

    const nomComplet = updated.prenom ? `${updated.prenom} ${updated.nom}` : updated.nom;
    if (acteurId) this.logs.log({ entrepriseId, userId: acteurId, userNom: acteurNom, action: 'MEMBRE_MODIFIE', entityType: 'MEMBRE', entityId: id, entityRef: nomComplet });
    return { ...updated, nomComplet, statut: computeStatut(updated.actif, updated.invitationToken) };
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

    const nomCible = utilisateur.nom;
    await this.prisma.utilisateur.update({ where: { id }, data: { actif: false } });
    this.logs.log({ entrepriseId, userId: demandeurId, userNom: '', action: 'MEMBRE_DESACTIVE', entityType: 'MEMBRE', entityId: id, entityRef: nomCible });
    return { message: 'Compte désactivé avec succès.' };
  }

  async activerUtilisateur(id: string, entrepriseId: string, acteurId = '', acteurNom = '') {
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

    await this.prisma.utilisateur.update({ where: { id }, data: { actif: true } });
    if (acteurId) this.logs.log({ entrepriseId, userId: acteurId, userNom: acteurNom, action: 'MEMBRE_ACTIVE', entityType: 'MEMBRE', entityId: id, entityRef: utilisateur.nom });
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

    const nomCible = utilisateur.nom;
    await this.prisma.utilisateur.delete({ where: { id } });
    this.logs.log({ entrepriseId, userId: demandeurId, userNom: '', action: 'MEMBRE_SUPPRIME', entityType: 'MEMBRE', entityId: id, entityRef: nomCible });
    return { message: 'Membre retiré avec succès.' };
  }

  async accepterInvitation(token: string, dto: AccepterInvitationDto) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { invitationToken: token },
      include: { entreprise: true },
    });
    if (!utilisateur) {
      throw new NotFoundException('Lien d\'invitation invalide ou déjà utilisé.');
    }
    if (utilisateur.invitationTokenExpiration && utilisateur.invitationTokenExpiration < new Date()) {
      throw new BadRequestException('Ce lien d\'invitation a expiré. Demandez une nouvelle invitation à votre administrateur.');
    }

    // Case A: invitee already has a CompteGlobal (existing Sayerli user joining a new company)
    if (utilisateur.compteGlobalId) {
      await this.prisma.utilisateur.update({
        where: { id: utilisateur.id },
        data: { actif: true, invitationToken: null, invitationTokenExpiration: null },
      });
      return {
        existingAccount: true,
        message: `Vous avez rejoint ${utilisateur.entreprise.nom}. Connectez-vous avec votre mot de passe habituel.`,
        entrepriseNom: utilisateur.entreprise.nom,
      };
    }

    // Case B: new user — requires password
    if (!dto.motDePasse) {
      throw new BadRequestException('Le mot de passe est requis pour activer votre compte.');
    }

    const hash = await bcrypt.hash(dto.motDePasse, 12);

    // Create CompteGlobal and link all utilisateurs with same email
    let compteGlobal = await this.prisma.compteGlobal.findUnique({ where: { email: utilisateur.email } });
    if (!compteGlobal) {
      compteGlobal = await this.prisma.compteGlobal.create({
        data: { email: utilisateur.email, motDePasseHash: hash },
      });
    }

    await this.prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: {
        motDePasseHash: hash,
        actif: true,
        invitationToken: null,
        invitationTokenExpiration: null,
        compteGlobalId: compteGlobal.id,
      },
    });

    // Link any OTHER existing utilisateurs with the same email (lazy migration)
    await this.prisma.utilisateur.updateMany({
      where: { email: utilisateur.email, compteGlobalId: null, id: { not: utilisateur.id } },
      data: { compteGlobalId: compteGlobal.id },
    });

    return { message: 'Votre compte a été activé. Vous pouvez maintenant vous connecter.' };
  }

  async infoInvitation(token: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({
      where: { invitationToken: token },
      include: { entreprise: true },
    });

    if (!utilisateur) return { invalid: true };

    const expired = !!(utilisateur.invitationTokenExpiration && utilisateur.invitationTokenExpiration < new Date());

    return {
      invalid: false,
      expired,
      nomComplet: utilisateur.prenom ? `${utilisateur.prenom} ${utilisateur.nom}` : utilisateur.nom,
      email: utilisateur.email,
      entrepriseNom: utilisateur.entreprise.nom,
      role: utilisateur.role,
      needsPassword: !utilisateur.compteGlobalId,
    };
  }
}
