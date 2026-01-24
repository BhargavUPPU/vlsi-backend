import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase body size limit for file uploads
  app.use(require('express').json({ limit: '200mb' }));
  app.use(require('express').urlencoded({ limit: '200mb', extended: true }));

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 8080;
  await app.listen(port);

  console.log(`🚀 Backend server is running on: http://localhost:${port}/api`);
}
bootstrap();
