import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

const cookieExtractor = req => {
  let jwt = null;

  jwt = req?.cookies?.['jwt'] || req?.headers?.['jwt'];

  return jwt
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return {
      _id: payload._id,
      role: payload.role,
      username: payload.name,
      password: payload.password,
      ip: payload.ip
    };
  }
}