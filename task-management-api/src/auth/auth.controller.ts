import { Controller, Post, UseGuards, Res, Body, BadRequestException, Get, UnauthorizedException, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'User login by username and password',
  })
  async login(
    @GetUser() user: User,
    @Res() res,
    @Req() req,
    @Body() loginDto: LoginDto,
  ) {
    const ip =
      req.headers?.['cf-connecting-ip']
      || req.headers?.['true-client-ip']
      || req.headers?.['client-ip']
      || '0.0.0.0';

    const result = await this.authService.login(user, ip);
    
    res.cookie('jwt', result.access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });

    return res.send(result);
  }
}