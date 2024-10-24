import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getByUsernameAndPassword(username, password);

    if (!user) {
      return null;
    }

    return {
      _id: new mongoose.Types.ObjectId(user['_id']).toString(),
      username: user.username,
      password: user.password,
      role: user.role,
    };
  }

  async login(user: any, ip: string) {
    const payload = {
      _id: user._id,
      password: user.password,
      username: user.username,
      role: user.role,
      ip: ip
    };

    return {
      access_token: this.jwtService.sign(payload),
      ...payload
    };
  }

}
