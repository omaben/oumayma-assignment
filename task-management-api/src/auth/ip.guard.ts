import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class IpGuard implements CanActivate {
  constructor() { }

  canActivate(context: ExecutionContext): boolean {
    if (process.env.DISABLE_VALIDATE_IP_IN_TOKEN === 'true') return true;

    const { user, headers } = context.switchToHttp().getRequest();

    const ip =
      headers?.['cf-connecting-ip']
      || headers?.['true-client-ip']
      || headers?.['client-ip']
      || '0.0.0.0';

    return user.ip === ip;
  }
}