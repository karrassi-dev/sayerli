import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @Post()
  submit(
    @Body() dto: ContactDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.contactService.submit(dto, ip, userAgent);
  }
}
