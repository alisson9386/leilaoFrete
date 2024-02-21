import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Adicione os métodos que seu servidor suporta
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.enableCors(corsOptions);
  await app.listen(3001);
}
bootstrap();
