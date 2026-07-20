import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  @IsIn(['fr', 'en', 'ar'])
  langue?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  devise?: string;

  @IsOptional()
  @IsString()
  @IsIn(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'])
  formatDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(99999)
  tauxEUR?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(99999)
  tauxUSD?: number;

  @IsOptional()
  @IsString()
  @IsIn(['ENCAISSEMENTS', 'DEBITS'])
  regimeTVA?: string;
}
