import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface LogDto {
  entrepriseId: string;
  userId: string;
  userNom: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityRef?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(private prisma: PrismaService) {}

  log(dto: LogDto): void {
    try {
      void this.prisma.activityLog
        .create({
          data: {
            entrepriseId: dto.entrepriseId,
            userId: dto.userId,
            userNom: dto.userNom ?? '',
            action: dto.action,
            entityType: dto.entityType,
            ...(dto.entityId  !== undefined && { entityId:  dto.entityId }),
            ...(dto.entityRef !== undefined && { entityRef: dto.entityRef }),
            ...(dto.metadata  !== undefined && { metadata:  dto.metadata as Prisma.InputJsonValue }),
          },
        })
        .then(() => this.logger.log(`[OK] ${dto.action} by ${dto.userNom || dto.userId}`))
        .catch(err => this.logger.error(`[FAIL] ${dto.action}: ${err?.message ?? err}`));
    } catch (err: unknown) {
      this.logger.error(`[FAIL-SYNC] ${dto.action}: ${(err as Error)?.message ?? err}`);
    }
  }

  async lister(
    entrepriseId: string,
    filters: {
      userId?: string;
      entityType?: string;
      dateDebut?: string;
      dateFin?: string;
      page?: number;
    },
  ) {
    const perPage = 50;
    const page = filters.page ?? 1;
    const skip = (page - 1) * perPage;

    const where: Prisma.ActivityLogWhereInput = {
      entrepriseId,
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.entityType && { entityType: filters.entityType }),
      ...((filters.dateDebut || filters.dateFin) && {
        createdAt: {
          ...(filters.dateDebut && { gte: new Date(filters.dateDebut) }),
          ...(filters.dateFin && { lte: new Date(filters.dateFin + 'T23:59:59.999Z') }),
        },
      }),
    };

    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return { logs, total, page, perPage };
  }

  async listerMembres(entrepriseId: string) {
    return this.prisma.utilisateur.findMany({
      where: { entrepriseId },
      select: { id: true, nom: true, prenom: true, role: true },
      orderBy: { nom: 'asc' },
    });
  }
}
