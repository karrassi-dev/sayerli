import { IsIn, IsOptional, IsString } from 'class-validator';

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
}
