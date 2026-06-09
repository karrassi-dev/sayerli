import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ModifierEntrepriseDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  devise?: string;
}
