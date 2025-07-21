// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'module-alias/register';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Pagos')
    .setDescription('Sistema de procesamiento de transacciones de pagos')
    .setVersion('1.0')
    .addTag('transactions', 'Operaciones con transacciones')
    .addBearerAuth() // Si usas autenticación JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  // Configura CORS para desarrollo
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port);

  Logger.log(`🚀 Application running on: http://localhost:${port}`);
  Logger.log(`📄 Swagger docs available on: http://localhost:${port}/api-docs`);
}
bootstrap();
