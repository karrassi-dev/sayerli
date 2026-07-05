import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum TypeItem {
  PRODUIT = 'PRODUIT',
  SERVICE = 'SERVICE',
}

export class CreerProduitDto {
  @IsString()
  nom: string;

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
}
