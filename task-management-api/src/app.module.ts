import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    MongooseModule.forRoot(process.env.DB_DEV),
    AuthModule,
    UsersModule,
  ],
  providers: [Logger],
})
export class AppModule { }
