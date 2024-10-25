import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { UserSeedService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    MongooseModule.forRoot(process.env.DB_DEV),
    AuthModule,
    UsersModule,
    TasksModule
  ],
  providers: [Logger, UserSeedService],
})
export class AppModule { }
