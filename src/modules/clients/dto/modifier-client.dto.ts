import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeClient } from './creer-client.dto';

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

  @IsOptional()
  @IsEnum(TypeClient)
  typeClient?: TypeClient;
}
