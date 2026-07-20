import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LigneBLDto {
  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Number)
  quantite?: number;

  @IsOptional()
  @IsString()
  unite?: string;

  @IsOptional()
  @Type(() => Number)
  ordre?: number;
}

export class CreerBonLivraisonDto {
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  devisId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  dateLivraison?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LigneBLDto)
  lignes: LigneBLDto[];
}
