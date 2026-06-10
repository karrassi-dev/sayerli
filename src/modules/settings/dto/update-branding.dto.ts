import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateBrandingDto {
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'La couleur doit être un code hexadécimal valide (ex: #2563eb)',
  })
  couleurPrimaire?: string;
}
