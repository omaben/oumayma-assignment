import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      this.logger.warn({
        type: 'UsersService',
        title: 'login',
        message: `${username} login.`,
        tag: `user, login`,
        meta: {
          message: `The username (${username}) or password is incorrect.`
        }
      })
      throw new UnauthorizedException({ message: 'The username or password is incorrect.' });
    }

    return user;
  }
}