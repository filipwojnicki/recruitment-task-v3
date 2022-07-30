import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './App/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.set('trust proxy', 'loopback');

  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle('recruitment-task-v3')
      .setDescription('recruitment-task-v3 API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(3000);
}
bootstrap();
