// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'module-alias/register';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('API de Pagos')
    .setDescription('Sistema de procesamiento de transacciones de pagos')
    .setVersion('1.0')
    .addTag('transactions', 'Operaciones con transacciones')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://ec2-3-14-72-122.us-east-2.compute.amazonaws.com',
      'http://3.14.72.122:44333',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Application running on: http://localhost:${port}`);
  Logger.log(`📄 Swagger docs available on: http://localhost:${port}/api-docs`);
}
bootstrap();
