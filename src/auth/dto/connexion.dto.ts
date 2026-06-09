import { IsEmail, IsString, MinLength } from 'class-validator';

export class ConnexionDto {
  @IsEmail({}, { message: 'Adresse email invalide.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  motDePasse: string;
}
