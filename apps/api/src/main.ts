import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Валидация
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // CORS
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: (origin, callback) => {
      // В продакшене запрещаем запросы без origin
      if (!origin) {
        if (process.env.NODE_ENV === 'production') {
          return callback(new Error('Origin required in production'));
        }
        // В разработке разрешаем (для Postman, мобильных приложений)
        return callback(null, true);
      }
      
      // Проверяем разрешенные origins
      if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        return callback(null, true);
      }
      
      // Разрешаем локальные IP адреса только в разработке
      if (process.env.NODE_ENV !== 'production' && origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/)) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('Neetrino Platform API')
    .setDescription('API для платформы поиска и просмотра демо-сайтов')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || process.env.PORT || 3001;
  const host = process.env.API_HOST || '0.0.0.0';
  await app.listen(port, host);
  
  const localIP = process.env.LOCAL_IP || 'localhost';
  console.log(`🚀 API сервер запущен на http://${localIP}:${port}`);
  console.log(`📚 Swagger документация: http://${localIP}:${port}/api/docs`);
}

bootstrap();
