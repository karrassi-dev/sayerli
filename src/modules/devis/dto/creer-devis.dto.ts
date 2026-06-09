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

export class LigneDevisDto {
  @IsString({ message: 'La description de la ligne est requise.' })
  description: string;

  @IsNumber({}, { message: 'La quantité doit être un nombre.' })
  @Min(0.001, { message: 'La quantité doit être supérieure à 0.' })
  quantite: number;

  @IsNumber({}, { message: 'Le prix unitaire doit être un nombre.' })
  @Min(0, { message: 'Le prix unitaire ne peut pas être négatif.' })
  prixUnitaire: number;
}

export class CreerDevisDto {
  @IsUUID('4', { message: 'Identifiant client invalide.' })
  clientId: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date d\'expiration invalide.' })
  dateExpiration?: string;

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

  @IsArray({ message: 'Les lignes du devis sont requises.' })
  @ValidateNested({ each: true })
  @Type(() => LigneDevisDto)
  lignes: LigneDevisDto[];
}
