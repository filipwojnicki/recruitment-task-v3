import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    console.log(req.ips.length ? req.ips[0] : req.ip);
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
