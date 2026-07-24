import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsPositive } from 'class-validator';
import { CategorieDepense } from '@prisma/client';

export class ModifierDepenseDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  montant?: number;

  @IsString()
  @IsOptional()
  devise?: string;

  @IsEnum(CategorieDepense)
  @IsOptional()
  categorie?: CategorieDepense;

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
  @IsOptional()
  date?: string;

  @IsNumber()
  @IsOptional()
  tauxTva?: number;

  @IsNumber()
  @IsOptional()
  montantTva?: number;
}
