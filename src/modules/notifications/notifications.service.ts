import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async listerNotifications(entrepriseId: string, nonLusSeulement?: boolean) {
    return this.prisma.notification.findMany({
      where: {
        entrepriseId,
        ...(nonLusSeulement && { lu: false }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async compterNonLues(entrepriseId: string) {
    const count = await this.prisma.notification.count({
      where: { entrepriseId, lu: false },
    });
    return { nonLues: count };
  }

  async marquerCommeLue(id: string, entrepriseId: string) {
    const notif = await this.prisma.notification.findFirst({
      where: { id, entrepriseId },
    });
    if (!notif) throw new NotFoundException('Notification introuvable.');

    return this.prisma.notification.update({
      where: { id },
      data: { lu: true },
    });
  }

  async marquerToutesCommeLues(entrepriseId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { entrepriseId, lu: false },
      data: { lu: true },
    });
    return { message: `${result.count} notification(s) marquée(s) comme lue(s).` };
  }

  async supprimerNotification(id: string, entrepriseId: string) {
    const notif = await this.prisma.notification.findFirst({
      where: { id, entrepriseId },
    });
    if (!notif) throw new NotFoundException('Notification introuvable.');

    await this.prisma.notification.delete({ where: { id } });
    return { message: 'Notification supprimée.' };
  }

  async supprimerToutesNotifications(entrepriseId: string) {
    const result = await this.prisma.notification.deleteMany({ where: { entrepriseId } });
    return { message: `${result.count} notification(s) supprimée(s).` };
  }
}
