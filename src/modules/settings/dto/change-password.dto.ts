import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  motDePasseActuel: string;

  @IsString()
  @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' })
  nouveauMotDePasse: string;

  @IsString()
  confirmationMotDePasse: string;
}
