import { IsString, MinLength } from 'class-validator';

export class AccepterInvitationDto {
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  motDePasse: string;
}
