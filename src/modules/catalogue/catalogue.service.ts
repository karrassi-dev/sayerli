import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreerProduitDto } from './dto/creer-produit.dto';
import { ModifierProduitDto } from './dto/modifier-produit.dto';

@Injectable()
export class CatalogueService {
  constructor(private prisma: PrismaService) {}

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

  async creer(dto: CreerProduitDto, entrepriseId: string) {
    return this.prisma.produitService.create({
      data: { ...dto, entrepriseId },
    });
  }

  async modifier(id: string, dto: ModifierProduitDto, entrepriseId: string) {
    const item = await this.prisma.produitService.findFirst({ where: { id, entrepriseId } });
    if (!item) throw new NotFoundException('Produit/service introuvable.');
    return this.prisma.produitService.update({ where: { id }, data: dto });
  }

  async supprimer(id: string, entrepriseId: string) {
    const item = await this.prisma.produitService.findFirst({ where: { id, entrepriseId } });
    if (!item) throw new NotFoundException('Produit/service introuvable.');
    await this.prisma.produitService.update({ where: { id }, data: { actif: false } });
    return { message: 'Élément archivé.' };
  }
}
