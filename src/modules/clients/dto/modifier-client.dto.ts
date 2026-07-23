import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
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
  ice?: string;

  @IsOptional()
  @IsString()
  ifFiscal?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;

  @IsOptional()
  @IsEnum(TypeClient)
  typeClient?: TypeClient;

  @IsOptional()
  @IsBoolean()
  rasActif?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  rasTaux?: number;
}
