import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  ice?: string;

  @IsOptional()
  @IsString()
  rc?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsString()
  pays?: string;

  @IsOptional()
  @IsString()
  titulaireCompte?: string;

  @IsOptional()
  @IsString()
  banque?: string;

  @IsOptional()
  @IsString()
  rib?: string;

  @IsOptional()
  @IsString()
  iban?: string;

  @IsOptional()
  @IsString()
  swift?: string;

  @IsOptional()
  @IsString()
  typeCompte?: string;

  @IsOptional()
  @IsString()
  activite?: string;

  @IsOptional()
  @IsString()
  prefixeFacture?: string;

  @IsOptional()
  @IsString()
  prefixeDevis?: string;

  @IsOptional()
  @IsString()
  prefixeBL?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  prochainNumeroFacture?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  prochainNumeroDevis?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  prochainNumeroBL?: number;
}
