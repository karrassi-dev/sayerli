import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MethodePaiement } from '@prisma/client';

export class ModifierPaiementDto {
  @IsOptional()
  @IsNumber({}, { message: 'Le montant doit être un nombre.' })
  @Min(0.01, { message: 'Le montant doit être supérieur à 0.' })
  montant?: number;

  @IsOptional()
  @IsEnum(MethodePaiement, {
    message: 'Méthode invalide. Valeurs: CASH, VIREMENT, CARTE, CHEQUE, MOBILE.',
  })
  methode?: MethodePaiement;

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
