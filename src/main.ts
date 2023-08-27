import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

console.log('process.env.NODE_ENV 123', process.env.NODE_ENV);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
  });
  app.useStaticAssets(join(__dirname, '..', 'frontend/dist/assets/'), {
    prefix: '/assets/',
  });
  // app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('Ai')
    .setDescription('Ai description')
    .setVersion('1.0')
    .addTag('openai')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 8888);
}
bootstrap();
