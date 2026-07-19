import { IsOptional, IsString, MinLength } from 'class-validator';

export class AccepterInvitationDto {
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  motDePasse?: string;
}
