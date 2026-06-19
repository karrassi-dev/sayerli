import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard';

@Controller('super-admin')
@UseGuards(SuperAdminGuard)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('entreprises')
  getEntreprises() {
    return this.superAdminService.getEntreprises();
  }

  @Get('entreprises/:id')
  getEntrepriseDetail(@Param('id') id: string) {
    return this.superAdminService.getEntrepriseDetail(id);
  }
}
