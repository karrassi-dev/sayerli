import { IsEnum } from 'class-validator';
import { StatutDevis } from '@prisma/client';

export class ModifierStatutDevisDto {
  @IsEnum(StatutDevis, {
    message: 'Statut invalide. Valeurs acceptées: BROUILLON, ENVOYE, VU, ACCEPTE, REFUSE.',
  })
  statut: StatutDevis;
}
