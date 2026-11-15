import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('SIS-Cyber-Fortress-API');
  const app = await NestFactory.create(AppModule);

  // Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Swagger needs inline scripts for UI
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Cookie Parser for HttpOnly Session Management
  app.use(cookieParser(process.env.COOKIE_SECRET || 'sis_cookie_secret_2026'));

  // CORS Configuration
  app.enableCors({
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });

  // Global API Prefix
  app.setGlobalPrefix('api/v1');

  // Global Exception Filter & Response Transform
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Input Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('SIS CYBER FORTRESS — REST API')
    .setDescription(
      'Enterprise REST API documentation for SIS Cyber Fortress 12-in-1 Cybersecurity Ecosystem. Comprehensive authentication, multi-tier RBAC, threat intelligence, and module endpoints.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide JWT Bearer token obtained from /api/v1/auth/login',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SIS Cyber Fortress — API Docs',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`========================================================`);
  logger.log(` SIS CYBER FORTRESS API INITIALIZED`);
  logger.log(` Base Endpoint:  http://localhost:${port}/api/v1`);
  logger.log(` Swagger Docs:   http://localhost:${port}/api/docs`);
  logger.log(` Health Status:  http://localhost:${port}/api/v1/system/health`);
  logger.log(` Diagnostics:    http://localhost:${port}/api/v1/system/diagnostics`);
  logger.log(`========================================================`);
}

bootstrap();
