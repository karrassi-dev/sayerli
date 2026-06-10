import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RoleType } from '@prisma/client';
import { SettingsService } from './settings.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateBrandingDto } from './dto/update-branding.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  // ─── PROFILE (all authenticated users) ──────────────────────────────────

  @Get('profile')
  getProfile(@UtilisateurCourant('id') userId: string) {
    return this.settingsService.getProfile(userId);
  }

  @Patch('profile')
  updateProfile(
    @UtilisateurCourant('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.settingsService.updateProfile(userId, dto);
  }

  // ─── COMPANY (admin only) ────────────────────────────────────────────────

  @Get('company')
  @Roles(RoleType.ADMIN)
  getCompany(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.settingsService.getCompany(entrepriseId);
  }

  @Patch('company')
  @Roles(RoleType.ADMIN)
  updateCompany(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.settingsService.updateCompany(entrepriseId, dto);
  }

  // ─── BRANDING (admin only) ───────────────────────────────────────────────

  @Get('branding')
  @Roles(RoleType.ADMIN)
  getBranding(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.settingsService.getBranding(entrepriseId);
  }

  @Patch('branding')
  @Roles(RoleType.ADMIN)
  updateBranding(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @Body() dto: UpdateBrandingDto,
  ) {
    return this.settingsService.updateBranding(entrepriseId, dto);
  }

  @Post('branding/logo')
  @Roles(RoleType.ADMIN)
  @UseInterceptors(FileInterceptor('logo', { storage: memoryStorage() }))
  uploadLogo(
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.settingsService.uploadLogo(entrepriseId, file);
  }

  // ─── PREFERENCES (all authenticated users) ──────────────────────────────

  @Get('preferences')
  getPreferences(
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
  ) {
    return this.settingsService.getPreferences(userId, entrepriseId);
  }

  @Patch('preferences')
  updatePreferences(
    @UtilisateurCourant('id') userId: string,
    @UtilisateurCourant('entrepriseId') entrepriseId: string,
    @UtilisateurCourant('role') role: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.settingsService.updatePreferences(userId, entrepriseId, role, dto);
  }

  // ─── NOTIFICATIONS (all authenticated users) ─────────────────────────────

  @Get('notifications')
  getNotifications(@UtilisateurCourant('id') userId: string) {
    return this.settingsService.getNotifications(userId);
  }

  @Patch('notifications')
  updateNotifications(
    @UtilisateurCourant('id') userId: string,
    @Body() dto: UpdateNotificationsDto,
  ) {
    return this.settingsService.updateNotifications(userId, dto);
  }

  // ─── SECURITY (all authenticated users) ──────────────────────────────────

  @Post('change-password')
  changePassword(
    @UtilisateurCourant('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.settingsService.changePassword(userId, dto);
  }

  // ─── BILLING (admin only) ─────────────────────────────────────────────────

  @Get('billing')
  @Roles(RoleType.ADMIN)
  getBilling(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.settingsService.getBilling(entrepriseId);
  }
}
