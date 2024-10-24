import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ErrorFunction } from 'src/common/error';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto, UserListDto } from './users.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt();
      const password = createUserDto.password;
      const passwordHash = await bcrypt.hash(password, salt);
      const createdUser = await this.userModel.create({
        ...createUserDto,
        password: passwordHash,
        isDeleted: false
      });
      this.logger.debug({
        type: 'UsersService',
        title: 'addUser',
        message: `Add new user.`,
        tag: `user,addUser,add,`,
        meta: {
          createUserDto
        }
      })
      return createdUser;
    } catch (err) {
      this.logger.error({
        type: 'UsersService',
        title: 'addUser',
        message: `Add new user.`,
        tag: `user,addUser,add,`,
        meta: {
          createUserDto,
          errorMessage: err.message,
          stack: err.stack
        }
      })
      return ErrorFunction(err)
    }
  }

  async list(findUserDto: UserListDto): Promise<{
    count: number,
    users: User[]
  }> {
    try {
      const { find, page, limit } = findUserDto;
      const { id, username, role } = find || {};
      const filter = {
        ...(id && { _id: id }),
        ...(username && { username: username }),
        ...(role && { role: role }),
      }
      
      const countUsers = await this.userModel.countDocuments({
        isDeleted: false,
        ...filter
      });

      const users = await this.userModel.find({
        isDeleted: false,
        ...filter
      }).select({
        __v: 0
      }).sort({ 'updatedAt': -1 })
        .skip(
          (page - 1) * limit
        ).limit(
          limit
        ).lean();
      if (users && countUsers) {
        this.logger.debug({
          type: 'UsersService',
          title: 'listUser',
          message: `Get list of users.`,
          tag: `user,listUser,list,`,
          meta: {
            findUserDto
          }
        })
      }

      return {
        count: countUsers,
        users: users
      }
    } catch (error) {
      this.logger.error({
        type: 'UsersService',
        title: 'listUser',
        message: `Get list of users.`,
        tag: `user,listUser,list`,
        meta: {
          findUserDto,
          errorMessage: error.message,
          stack: error.stack
        }
      })
      throw new BadRequestException();
    }
  }

  async findOne(user_id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({
        ...(user_id && { _id: user_id }),
        isDeleted: false
      })
      .select({
        password: 0,
      })
      .lean();
    this.logger.debug({
      type: 'UsersService',
      title: 'findUser',
      message: `Get user detail ${user_id}.`,
      tag: `user,listDetails`,
      meta: {
        _id: user_id
      }
    })
    if (!user) {
      throw new BadRequestException('User not found.');
    } else {
      return user as UserDocument;
    }
  }

  async update(
    user_id: string,
    updateUserDto: UpdateUserDto,
    by: UserDocument,
  ): Promise<any> {
    try {
      const newUser = await this.userModel
        .findOneAndUpdate(
          {
            _id: user_id,
            isDeleted: false
          },
          { $set: updateUserDto },
          { new: true })
        .select({
          password: 0,
        })
        .lean();
      if (!newUser) {
        throw new BadRequestException('User not found.');
      } else {
        this.logger.debug({
          type: 'UsersService',
          title: 'updateUser',
          message: `Edit user ${user_id} by ${by._id} (${by.username}).`,
          tag: `user, editUser`,
          meta: {
            _id: user_id,
            updateUserDto
          }
        })
        return newUser
      }
    } catch (err) {
      this.logger.error({
        type: 'UsersService',
        title: 'updateUser',
        message: `Edit user ${user_id} by ${by._id} (${by.username}).`,
        tag: `user, editUser`,
        meta: {
          _id: user_id,
          updateUserDto,
          errorMessage: err.message,
          stack: err.stack
        }
      })
      return ErrorFunction(err)
    }

  }

  async changePassword(user_id: string, newPassword: string, by: UserDocument, req: any): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = newPassword;
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await this.userModel
      .findOneAndUpdate(
        {
          _id: user_id,
          isDeleted: false
        },
        { $set: { password: passwordHash } })
      .select({
        password: 0,
      })
      .lean();

    if (!newUser) {
      throw new BadRequestException('User not found.');
    } else {
      this.logger.debug({
        type: 'UsersService',
        title: 'updateUserPassword',
        message: `Edit user password ${user_id} by ${by._id} (${by.username}).`,
        tag: `user, editUser, EditUserPassword,  password`,
        meta: {
          _id: user_id,
          newPassword
        }
      })
      return newUser
    }
  }
  async changeMyPassword(user_id: string, oldPassword: string, newPassword: string, by: UserDocument, req: any): Promise<User> {
    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    if (!bcrypt.compareSync(oldPassword, by.password)) {
      throw new UnauthorizedException({
        message: 'Old Password Wrong.'
      });
    }
    const newUser = await this.userModel
      .findOneAndUpdate(
        {
          _id: user_id,
          isDeleted: false
        },
        { $set: { password: newPasswordHash } })
      .lean();
    if (!newUser) {
      throw new BadRequestException('User not found.');
    } else {
      this.logger.debug({
        type: 'UsersService',
        title: 'updateCurrentUserPassword',
        message: `Edit current user password ${user_id} by ${by._id} (${by.username}).`,
        tag: `user, editUser, EditUserPassword,  password`,
        meta: {
          _id: user_id,
          newPassword
        }
      })
      return newUser
    }
  }

  async delete(user_id: string, by: UserDocument, req: any): Promise<User> {
    const newUser = await this.userModel
      .findOneAndUpdate(
        { _id: user_id, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
      )
      .select({
        password: 0,
      })
      .lean();
    if (!newUser) {
      throw new BadRequestException('User not found.');
    } else {
      this.logger.debug({
        type: 'UsersService',
        title: 'deleteUser',
        message: `Delete user password ${user_id} by ${by._id} (${by.username}).`,
        tag: `user, deleteUser`,
        meta: {
          _id: user_id,
        }
      })
      return newUser
    }
  }

  async getByUsernameAndPassword(username: string, password: string): Promise<User> {
    const user = await this.userModel
      .findOne({
        username: username,
        isDeleted: false
      })
      .lean();

    if (!user) return null;

    if (!bcrypt.compareSync(password, user.password)) return null;
    this.logger.debug({
      type: 'UsersService',
      title: 'login',
      message: `${username} login.`,
      tag: `user, login`,
      meta: {
        user
      }
    })
    return user;
  }
}
