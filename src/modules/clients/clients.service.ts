import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreerClientDto } from './dto/creer-client.dto';
import { ModifierClientDto } from './dto/modifier-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

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
      include: {
        _count: {
          select: { devis: true, factures: true },
        },
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

  async creerClient(dto: CreerClientDto, entrepriseId: string) {
    return this.prisma.client.create({
      data: {
        ...dto,
        entrepriseId,
      },
    });
  }

  async modifierClient(id: string, dto: ModifierClientDto, entrepriseId: string) {
    const client = await this.prisma.client.findFirst({ where: { id, entrepriseId } });
    if (!client) throw new NotFoundException('Client introuvable.');

    return this.prisma.client.update({
      where: { id },
      data: dto,
    });
  }

  async supprimerClient(id: string, entrepriseId: string) {
    const client = await this.prisma.client.findFirst({ where: { id, entrepriseId } });
    if (!client) throw new NotFoundException('Client introuvable.');

    await this.prisma.client.update({
      where: { id },
      data: { actif: false },
    });
    return { message: 'Client archivé avec succès.' };
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
