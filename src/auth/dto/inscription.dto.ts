import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class InscriptionDto {
  @IsString({ message: 'Le nom de l\'entreprise est requis.' })
  nomEntreprise: string;

  @IsEmail({}, { message: 'Adresse email de l\'entreprise invalide.' })
  emailEntreprise: string;

  @IsOptional()
  @IsString()
  telephoneEntreprise?: string;

  @IsOptional()
  @IsString()
  adresseEntreprise?: string;

  @IsString({ message: 'Votre nom est requis.' })
  nomAdmin: string;

  @IsEmail({}, { message: 'Votre adresse email est invalide.' })
  emailAdmin: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  motDePasse: string;
}
