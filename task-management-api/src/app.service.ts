import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { Role } from './common/user.role.enum';
import { CreateUserDto } from './users/users.dto';

@Injectable()
export class UserSeedService implements OnModuleInit {
    constructor(private readonly usersService: UsersService) { }

    async onModuleInit() {
        const existingUsers = await this.usersService.list({ find: {}, limit: 1, page: 1 }); // List users to check if any exist

        if (existingUsers.count === 0) {
            const adminUser: CreateUserDto = {
                username: 'admin',
                password: 'admin123', // Use a secure password in production
                role: Role.ADMIN,
                avatar: ''
                // Add other required fields here
            };

            await this.usersService.create(adminUser);
            console.log('Default admin user created.');
        } else {
            console.log('Admin user already exists.');
        }
    }
}
