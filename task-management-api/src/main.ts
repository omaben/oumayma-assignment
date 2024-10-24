import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();
const PORT = process.env.PORT || 3006;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Add the correct front-end URL here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to send cookies, tokens, etc.
  });

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('Task Management API description')
    .setVersion('1.0')
    .addTag('Task Management')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  
}
bootstrap();