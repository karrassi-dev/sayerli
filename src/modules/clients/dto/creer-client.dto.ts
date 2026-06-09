import { IsEmail, IsOptional, IsString } from 'class-validator';

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
  notes?: string;
}
