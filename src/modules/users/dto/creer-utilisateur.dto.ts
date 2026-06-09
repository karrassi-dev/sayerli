import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleType } from '@prisma/client';

export class CreerUtilisateurDto {
  @IsOptional()
  @IsString({ message: 'Le prénom doit être une chaîne de caractères.' })
  prenom?: string;

  @IsString({ message: 'Le nom est requis.' })
  nom: string;

  @IsEmail({}, { message: 'Adresse email invalide.' })
  email: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsEnum(RoleType, { message: 'Rôle invalide. Choisissez: ADMIN, MANAGER, COMMERCIAL, COMPTABLE.' })
  role: RoleType;
}
