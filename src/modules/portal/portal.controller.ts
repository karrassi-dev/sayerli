import { Controller, Get, Post, Param, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { PortalService } from './portal.service';

@Controller('public/portal')
export class PortalController {
  constructor(private portalService: PortalService) {}

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  @Get(':token')
  async obtenirPortal(@Param('token') token: string) {
    return this.portalService.obtenirPortal(token);
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post(':token/devis/:devisId/accepter')
  async accepterDevis(
    @Param('token') token: string,
    @Param('devisId') devisId: string,
    @Body() body: { signatureClient?: string; signatureClientNom?: string } = {},
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip ?? '';
    return this.portalService.accepterDevis(token, devisId, {
      signatureClient: body.signatureClient,
      signatureClientNom: body.signatureClientNom,
      signatureClientIp: ip,
    });
  }
}
