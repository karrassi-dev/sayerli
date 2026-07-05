import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeItem } from './creer-produit.dto';

export class ModifierProduitDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TypeItem)
  type?: TypeItem;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prixUnitaire?: number;

  @IsOptional()
  @IsString()
  unite?: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
