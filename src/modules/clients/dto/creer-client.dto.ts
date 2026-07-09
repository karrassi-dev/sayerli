import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum TypeClient {
  PARTICULIER = 'PARTICULIER',
  ENTREPRISE = 'ENTREPRISE',
  FREELANCE = 'FREELANCE',
}

export class CreerClientDto {
  @IsString({ message: 'Le nom du client est requis.' })
  nom: string;

  @IsOptional()
  @IsEmail({}, { message: 'Adresse email invalide.' })
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  nomEntreprise?: string;

  @IsOptional()
  @IsString()
  ice?: string;

  @IsOptional()
  @IsString()
  ifFiscal?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(TypeClient)
  typeClient?: TypeClient;
}
