import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleType } from '@prisma/client';

export class ModifierUtilisateurDto {
  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionsRetirees?: string[];
}
