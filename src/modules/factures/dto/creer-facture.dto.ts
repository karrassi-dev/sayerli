import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LigneFactureDto {
  @IsString({ message: 'La description est requise.' })
  description: string;

  @IsNumber()
  @Min(0.001)
  quantite: number;

  @IsNumber()
  @Min(0)
  prixUnitaire: number;
}

export class CreerFactureDto {
  @IsUUID('4', { message: 'Identifiant client invalide.' })
  clientId: string;

  @IsOptional()
  @IsUUID('4')
  devisId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date d\'échéance invalide.' })
  dateEcheance?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxe?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  remise?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LigneFactureDto)
  lignes: LigneFactureDto[];
}
