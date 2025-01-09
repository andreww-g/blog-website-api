import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ConfigService } from './config/config.service';


async function bootstrap () {
  const {
    server: { port, host },
  } = new ConfigService();

  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('v1', { exclude: ['/health'] });

  patchNestJsSwagger();

  const configSwagger = new DocumentBuilder()
    .setTitle('Blog website API')
    .setDescription('The Blog Website API description')
    .setVersion('1.0')
    .addApiKey({
      type: 'apiKey',
      name: '_accessToken',
      description: 'Enter access token',
      in: 'query',
    })
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);

  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
    swaggerOptions: { persistAuthorization: true },
  };

  SwaggerModule.setup('v1/docs', app, document, options);

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(port, () => {
    Logger.log(`API Gateway REST is running on http://${host}:${port}/v1/docs`, 'Bootstrap');
  });
}

bootstrap();

for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
  process.on(signal, () => {
    process.exit();
  });
}
