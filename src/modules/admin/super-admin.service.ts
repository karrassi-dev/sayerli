import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  async getEntreprises() {
    const entreprises = await this.prisma.entreprise.findMany({
      select: {
        id: true,
        nom: true,
        email: true,
        plan: true,
        planDebut: true,
        planExpiration: true,
        createdAt: true,
        _count: {
          select: {
            utilisateurs: true,
            devis: true,
            factures: true,
            clients: true,
          },
        },
        utilisateurs: {
          select: { dernierAcces: true },
          orderBy: { dernierAcces: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return entreprises.map((e) => ({
      id: e.id,
      nom: e.nom,
      email: e.email,
      plan: e.plan,
      planDebut: e.planDebut,
      planExpiration: e.planExpiration,
      createdAt: e.createdAt,
      nombreUtilisateurs: e._count.utilisateurs,
      nombreDevis: e._count.devis,
      nombreFactures: e._count.factures,
      nombreClients: e._count.clients,
      enLigne:
        e.utilisateurs[0]?.dernierAcces != null &&
        e.utilisateurs[0].dernierAcces >= sevenDaysAgo,
      dernierAcces: e.utilisateurs[0]?.dernierAcces ?? null,
    }));
  }

  async getEntrepriseDetail(id: string) {
    const entreprise = await this.prisma.entreprise.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        adresse: true,
        ville: true,
        pays: true,
        ice: true,
        rc: true,
        logo: true,
        website: true,
        banque: true,
        rib: true,
        iban: true,
        plan: true,
        planDebut: true,
        planExpiration: true,
        createdAt: true,
        utilisateurs: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true,
            actif: true,
            dernierAcces: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        devis: {
          select: {
            id: true,
            reference: true,
            statut: true,
            totalTTC: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        factures: {
          select: {
            id: true,
            numeroFacture: true,
            statut: true,
            totalTTC: true,
            montantPaye: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        paiements: {
          select: {
            id: true,
            montant: true,
            methode: true,
            datePaiement: true,
          },
          orderBy: { datePaiement: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            utilisateurs: true,
            devis: true,
            factures: true,
            clients: true,
            paiements: true,
          },
        },
      },
    });

    const caTotal = entreprise.factures
      .filter((f) => f.statut === 'PAYEE' || f.statut === 'PARTIELLE')
      .reduce((sum, f) => sum + Number(f.montantPaye), 0);

    const devisAcceptes = entreprise.devis.filter(
      (d) => d.statut === 'ACCEPTE',
    ).length;

    const tauxConversion =
      entreprise._count.devis > 0
        ? Math.round((devisAcceptes / entreprise._count.devis) * 100)
        : 0;

    return {
      ...entreprise,
      stats: {
        nombreUtilisateurs: entreprise._count.utilisateurs,
        nombreDevis: entreprise._count.devis,
        nombreFactures: entreprise._count.factures,
        nombreClients: entreprise._count.clients,
        nombrePaiements: entreprise._count.paiements,
        caTotal,
        tauxConversion,
      },
    };
  }
}
