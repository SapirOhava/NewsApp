import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Optional: Use Zod globally instead of class-validator
  // This validates all requests using Zod schemas
  app.useGlobalPipes(new ZodValidationPipe());
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();