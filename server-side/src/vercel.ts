import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

// This is the entry point for Vercel serverless functions
async function bootstrap() {
  console.log('[vercel] Starting NestJS application...');
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'https://bloogy-ashy.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.init();
}

bootstrap();

export default server;
