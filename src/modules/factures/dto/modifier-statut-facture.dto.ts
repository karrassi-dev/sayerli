import { IsEnum } from 'class-validator';
import { StatutFacture } from '@prisma/client';

export class ModifierStatutFactureDto {
  @IsEnum(StatutFacture, {
    message: 'Statut invalide. Valeurs: BROUILLON, ENVOYEE, PAYEE, PARTIELLE, EN_RETARD.',
  })
  statut: StatutFacture;
}
