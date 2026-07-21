import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class GrouperEnFactureDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  blIds: string[];

  @IsString()
  clientId: string;
}
