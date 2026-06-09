import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class ModifierClientDto {
  @IsOptional()
  @IsString()
  nom?: string;

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

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
