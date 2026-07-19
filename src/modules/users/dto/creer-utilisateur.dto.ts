import { IsEmail, IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { RoleType } from '@prisma/client';

export class CreerUtilisateurDto {
  @IsOptional()
  @IsString()
  prenom?: string;

  @IsString({ message: 'Le nom est requis.' })
  nom: string;

  @IsEmail({}, { message: 'Adresse email invalide.' })
  email: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsEnum(RoleType, { message: 'Rôle invalide.' })
  role: RoleType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionsRetirees?: string[];
}
