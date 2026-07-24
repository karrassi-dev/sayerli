import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsPositive } from 'class-validator';
import { CategorieDepense } from '@prisma/client';

export class CreerDepenseDto {
  @IsNumber()
  @IsPositive()
  montant: number;

  @IsString()
  @IsOptional()
  devise?: string;

  @IsEnum(CategorieDepense)
  categorie: CategorieDepense;

  @IsString()
  @IsOptional()
  categoriePersonnalisee?: string;

  @IsString()
  @IsOptional()
  fournisseur?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  receiptKey?: string;

  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @IsNumber()
  @IsOptional()
  receiptSizeBytes?: number;

  @IsNumber()
  @IsOptional()
  tauxTva?: number;

  @IsNumber()
  @IsOptional()
  montantTva?: number;
}
