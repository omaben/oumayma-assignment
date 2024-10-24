import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IpGuard } from 'src/auth/ip.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '../common/user.role.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User, UserDocument } from './schemas/user.schema';
import { IdParamDto } from 'src/common/id-param.dto';
import { ChangeUserPasswordDto, CreateUserDto, UpdateUserDto, ChangeCurrentUserPasswordDto, UserListDto } from './users.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @ApiOperation({
    summary: 'Current user profile',
    description: 'Get current user profile.'
  })
  async profile(
    @GetUser() user: UserDocument
  ): Promise<User> {
    return await this.usersService.findOne(user._id as string);
  }

  @Patch('change/my-password')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @ApiOperation({
    summary: 'Change current user password',
    description: 'Change current user password.'
  })
  async changeMyUserPassword(
    @Body() ChangeCurrentUserPasswordDto: ChangeCurrentUserPasswordDto,
    @Req() req,
    @GetUser() user: UserDocument
  ): Promise<User> {
    return await this.usersService.changeMyPassword(user._id as string, ChangeCurrentUserPasswordDto.oldPassword, ChangeCurrentUserPasswordDto.newPassword, user, req);
  }

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @ApiOperation({
    summary: 'Create user',
    description: 'Create user by <b>admin</b> with role.'
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('list')
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @ApiOperation({
    summary: 'List of users',
    description: 'Get a list of users by <b>admin</b> role.'
  })
  list(
    @Body() findUserDto: UserListDto,
  ) {
    return this.usersService.list(findUserDto);
  }

  @Get(':id')
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get user details',
    description: 'Get the user details by <b>admin</b> role.'
  })
  async get(
    @Param() params: IdParamDto,
  ): Promise<User> {
    return await this.usersService.findOne(params.id as string);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({
    summary: 'Edit user',
    description: 'Edit user by <b>admin</b> role.'
  })
  async update(
    @Param() params: IdParamDto,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
    @GetUser() user: UserDocument
  ): Promise<User> {
    return await this.usersService.update(params.id, updateUserDto, user);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({
    summary: 'Change user password',
    description: 'Change user password by <b>admin</b> role.'
  })
  async changePassword(
    @Param() params: IdParamDto,
    @Body() changeUserPasswordDto: ChangeUserPasswordDto,
    @Req() req,
    @GetUser() user: UserDocument
  ): Promise<User> {
    return await this.usersService.changePassword(params.id, changeUserPasswordDto.password, user, req);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({
    summary: 'Delete user',
    description: 'Soft delete user by <b>admin</b> role.'
  })
  async delete(
    @Param() params: IdParamDto,
    @Req() req,
    @GetUser() user: UserDocument
  ): Promise<User> {
    return await this.usersService.delete(params.id, user, req);
  }
}
