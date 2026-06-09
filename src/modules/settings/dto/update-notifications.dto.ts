import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationsDto {
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationsDevis?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationsFactures?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationsPaiements?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationsSysteme?: boolean;
}
