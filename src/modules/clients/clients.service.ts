import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { CreerClientDto } from './dto/creer-client.dto';
import { ModifierClientDto } from './dto/modifier-client.dto';
import { PLAN_LIMITS, verifierLimite } from '../../common/utils/plan-limits';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private logs: LogsService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  private bustDashboard(entrepriseId: string) {
    void this.cache.del(`dashboard:${entrepriseId}`);
  }

  async listerClients(entrepriseId: string, recherche?: string) {
    const clients = await this.prisma.client.findMany({
      where: {
        entrepriseId,
        actif: true,
        ...(recherche && {
          OR: [
            { nom: { contains: recherche, mode: 'insensitive' } },
            { email: { contains: recherche, mode: 'insensitive' } },
            { nomEntreprise: { contains: recherche, mode: 'insensitive' } },
            { telephone: { contains: recherche } },
          ],
        }),
      },
      select: {
        id: true, nom: true, email: true, telephone: true,
        nomEntreprise: true, ice: true, ifFiscal: true, notes: true, actif: true,
        typeClient: true, createdAt: true, updatedAt: true,
        portalToken: true,
        _count: { select: { devis: true, factures: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return clients;
  }

  async obtenirClient(id: string, entrepriseId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, entrepriseId },
      include: {
        devis: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, reference: true, statut: true, totalTTC: true, createdAt: true },
        },
        factures: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, numeroFacture: true, statut: true, totalTTC: true, createdAt: true },
        },
      },
    });
    if (!client) throw new NotFoundException('Client introuvable.');
    return client;
  }

  async creerClient(dto: CreerClientDto, entrepriseId: string, userId: string, userNom: string) {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { plan: true },
    });
    if (!entreprise) throw new NotFoundException('Entreprise introuvable.');
    const limite = PLAN_LIMITS[entreprise.plan].clients;
    const actuel = await this.prisma.client.count({ where: { entrepriseId, actif: true } });
    verifierLimite('clients', actuel, limite);

    const client = await this.prisma.client.create({ data: { ...dto, entrepriseId } });
    this.logs.log({ entrepriseId, userId, userNom, action: 'CLIENT_CREE', entityType: 'CLIENT', entityId: client.id, entityRef: client.nom });
    this.bustDashboard(entrepriseId);
    return client;
  }

  async modifierClient(id: string, dto: ModifierClientDto, entrepriseId: string, userId: string, userNom: string) {
    const client = await this.prisma.client.findFirst({ where: { id, entrepriseId } });
    if (!client) throw new NotFoundException('Client introuvable.');

    const updated = await this.prisma.client.update({ where: { id }, data: dto });
    this.logs.log({ entrepriseId, userId, userNom, action: 'CLIENT_MODIFIE', entityType: 'CLIENT', entityId: id, entityRef: client.nom });
    this.bustDashboard(entrepriseId);
    return updated;
  }

  async supprimerClient(id: string, entrepriseId: string, userId: string, userNom: string) {
    const client = await this.prisma.client.findFirst({ where: { id, entrepriseId } });
    if (!client) throw new NotFoundException('Client introuvable.');

    await this.prisma.client.update({ where: { id }, data: { actif: false } });
    this.logs.log({ entrepriseId, userId, userNom, action: 'CLIENT_SUPPRIME', entityType: 'CLIENT', entityId: id, entityRef: client.nom });
    this.bustDashboard(entrepriseId);
    return { message: 'Client archivé avec succès.' };
  }

  async lienPortal(id: string, entrepriseId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, entrepriseId },
      select: { portalToken: true },
    });
    if (!client) throw new NotFoundException('Client introuvable.');
    const frontendUrl = process.env.FRONTEND_URL || 'https://sayerli.com';
    return { url: `${frontendUrl}/portal/${client.portalToken}` };
  }

  async statistiquesClient(id: string, entrepriseId: string) {
    const client = await this.prisma.client.findFirst({ where: { id, entrepriseId } });
    if (!client) throw new NotFoundException('Client introuvable.');

    const [totalDevis, totalFactures, totalPaye] = await Promise.all([
      this.prisma.devis.count({ where: { clientId: id, entrepriseId } }),
      this.prisma.facture.count({ where: { clientId: id, entrepriseId } }),
      this.prisma.paiement.aggregate({
        where: { facture: { clientId: id }, entrepriseId },
        _sum: { montant: true },
      }),
    ]);

    return {
      client: { id: client.id, nom: client.nom },
      totalDevis,
      totalFactures,
      totalPayeMAD: totalPaye._sum.montant || 0,
    };
  }
}
