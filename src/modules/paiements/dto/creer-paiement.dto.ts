import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { MethodePaiement } from '@prisma/client';

export class CreerPaiementDto {
  @IsUUID('4', { message: 'Identifiant facture invalide.' })
  factureId: string;

  @IsNumber({}, { message: 'Le montant doit être un nombre.' })
  @Min(0.01, { message: 'Le montant doit être supérieur à 0.' })
  montant: number;

  @IsEnum(MethodePaiement, {
    message: 'Méthode invalide. Valeurs: CASH, VIREMENT, CARTE, CHEQUE, MOBILE.',
  })
  methode: MethodePaiement;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsDateString()
  datePaiement?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
