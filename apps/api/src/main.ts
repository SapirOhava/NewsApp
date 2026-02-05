import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation
  // This automatically validates all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strip properties that don't have decorators (removes properties not defined in your DTO)
      forbidNonWhitelisted: true, // Throw error if unknown properties are sent (returns 400 if extra properties are sent)
      transform: true,        // Automatically transform payloads to DTO instances (converts plain JSON to DTO class instances)
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically (string to number, etc.)
      },
    }),
  );
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();