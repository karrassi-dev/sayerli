import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class ContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(trim)
  name: string;

  @IsEmail({}, { message: 'Adresse email invalide.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(trim)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trim)
  company?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @Transform(trim)
  subject: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @Transform(trim)
  message: string;
}
