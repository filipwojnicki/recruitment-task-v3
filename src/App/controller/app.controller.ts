import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from '../service/app.service';

import { ThrottlerBehindProxyGuard } from '../../common/throttler-behind-proxy.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ThrottlerBehindProxyGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
