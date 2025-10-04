import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import formatValidationErrors from './common/lib/format-validation-errors';
import { GlobalExceptionFilter } from './common/filters/global-exception-filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as cookieParser from 'cookie-parser';
import { setDefaultOptions } from 'date-fns';
import { es } from 'date-fns/locale';

setDefaultOptions({ locale: es });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Type', 'Authorization'], // opcional
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          statusCode: 400,
          message: 'La validación falló',
          errors: formatValidationErrors(errors),
        });
      },
    }),
  );

  app.use(cookieParser());

  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
