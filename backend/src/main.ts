import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'module-alias/register';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // Middleware para redirigir HTTP a HTTPS
  app.use((req: Request, res: Response, next: NextFunction) => {
    const isLocalhost = req.hostname.includes('localhost');
    if (!isLocalhost && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
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
  // Configuración CORS más estricta
  app.enableCors({
    origin: [
      'https://main.d1yixiw7e2sukl.amplifyapp.com',
      'http://localhost:4200',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port);

  Logger.log(`🚀 Application running on: http://localhost:${port}`);
  Logger.log(`📄 Swagger docs available on: http://localhost:${port}/api-docs`);
}
bootstrap();
