import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './App/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle('recruitment-task-v3')
      .setDescription('recruitment-task-v3 API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
