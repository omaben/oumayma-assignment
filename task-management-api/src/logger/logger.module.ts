import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

const logDir = 'logs';
const fs = require('fs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot({
      
      transports: [
        new winston.transports.File({
          level: 'error',
          filename: `logs/errors.log`,
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            nestWinstonModuleUtilities.format.nestLike(process.env.SERVER_NAME, {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          level: 'warn',
          filename: `logs/warnings.log`,
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            nestWinstonModuleUtilities.format.nestLike(process.env.SERVER_NAME, {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          level: 'debug',
          filename: 'logs/debug.log',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            nestWinstonModuleUtilities.format.nestLike(process.env.SERVER_NAME, {
              prettyPrint: true,
            }),
          ),
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({
          level: 'error',
          filename: `logs/errors.log`,
          format: winston.format.combine(
            nestWinstonModuleUtilities.format.nestLike(process.env.SERVER_NAME, {
              prettyPrint: true,
            }),
          ),
        })
      ],
    }),
  ],
  controllers: [],
  providers: [Logger],
  exports: [WinstonModule, Logger],
})
@Module({})
export class LoggerModule { }
