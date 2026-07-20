import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { CreerProduitDto } from './dto/creer-produit.dto';
import { ModifierProduitDto } from './dto/modifier-produit.dto';

@Injectable()
export class CatalogueService {
  constructor(
    private prisma: PrismaService,
    private logs: LogsService,
  ) {}

  async lister(entrepriseId: string, recherche?: string, type?: string) {
    return this.prisma.produitService.findMany({
      where: {
        entrepriseId,
        actif: true,
        ...(type && ['PRODUIT', 'SERVICE'].includes(type) ? { type: type as any } : {}),
        ...(recherche ? {
          OR: [
            { nom: { contains: recherche, mode: 'insensitive' } },
            { description: { contains: recherche, mode: 'insensitive' } },
          ],
        } : {}),
      },
      orderBy: [{ type: 'asc' }, { nom: 'asc' }],
    });
  }

  async creer(dto: CreerProduitDto, entrepriseId: string, userId: string, userNom: string) {
    const item = await this.prisma.produitService.create({ data: { ...dto, entrepriseId } });
    this.logs.log({ entrepriseId, userId, userNom, action: 'CATALOGUE_CREE', entityType: 'CATALOGUE', entityId: item.id, entityRef: item.nom });
    return item;
  }

  async modifier(id: string, dto: ModifierProduitDto, entrepriseId: string, userId: string, userNom: string) {
    const item = await this.prisma.produitService.findFirst({ where: { id, entrepriseId } });
    if (!item) throw new NotFoundException('Produit/service introuvable.');
    const updated = await this.prisma.produitService.update({ where: { id }, data: dto });
    this.logs.log({ entrepriseId, userId, userNom, action: 'CATALOGUE_MODIFIE', entityType: 'CATALOGUE', entityId: id, entityRef: item.nom });
    return updated;
  }

  async supprimer(id: string, entrepriseId: string, userId: string, userNom: string) {
    const item = await this.prisma.produitService.findFirst({ where: { id, entrepriseId } });
    if (!item) throw new NotFoundException('Produit/service introuvable.');
    await this.prisma.produitService.update({ where: { id }, data: { actif: false } });
    this.logs.log({ entrepriseId, userId, userNom, action: 'CATALOGUE_SUPPRIME', entityType: 'CATALOGUE', entityId: id, entityRef: item.nom });
    return { message: 'Élément archivé.' };
  }
}
