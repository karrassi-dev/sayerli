import { Controller, Post, Body, Headers, Logger, HttpCode } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('email-received')
  @Public()
  @HttpCode(200)
  async handleEmailReceived(
    @Body() payload: any,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    if (payload?.type !== 'email.received') return { ok: true };

    this.logger.log(`Inbound email received: ${payload.data?.email_id}`);

    await this.webhooksService.forwardInboundEmail(payload.data, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });

    return { ok: true };
  }
}
