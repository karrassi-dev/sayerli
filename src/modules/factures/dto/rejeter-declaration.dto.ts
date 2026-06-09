import { IsOptional, IsString } from 'class-validator';

export class RejeterDeclarationDto {
  @IsOptional()
  @IsString()
  raison?: string;
}
