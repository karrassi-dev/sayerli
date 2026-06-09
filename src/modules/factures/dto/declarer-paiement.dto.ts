import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MethodePaiement } from '@prisma/client';

export class DeclarerPaiementDto {
  @IsNumber()
  @Min(0.01, { message: 'Le montant doit être supérieur à 0.' })
  montant: number;

  @IsEnum(MethodePaiement, { message: 'Méthode de paiement invalide.' })
  methode: MethodePaiement;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date de paiement invalide.' })
  datePaiement?: string;
}
