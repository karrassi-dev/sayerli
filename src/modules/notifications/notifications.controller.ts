import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async lister(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Query('nonLues') nonLues?: string,
  ) {
    return this.notificationsService.listerNotifications(entrepriseId, nonLues === 'true');
  }

  @Get('compteur')
  async compteur(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.notificationsService.compterNonLues(entrepriseId);
  }

  @Patch('tout-lire')
  async marquerToutesLues(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.notificationsService.marquerToutesCommeLues(entrepriseId);
  }

  @Patch(':id/lire')
  async marquerLue(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.notificationsService.marquerCommeLue(id, entrepriseId);
  }

  @Delete()
  async supprimerToutes(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.notificationsService.supprimerToutesNotifications(entrepriseId);
  }

  @Delete(':id')
  async supprimer(
    @Param('id') id: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.notificationsService.supprimerNotification(id, entrepriseId);
  }
}
