import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Si es un error de Nest (ForbiddenException, BadRequestException, etc.)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      const responseBody =
        typeof res === 'string'
          ? { statusCode: status, message: res, errors: null }
          : {
              statusCode: status,
              message: (res as any).message || 'Error',
              errors: (res as any).errors || null,
            };

      return response.status(status).json(responseBody);
    }

    // Si es error conocido de Prisma
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        const target = (exception.meta?.target as string[]) || [];

        const errors: Record<string, string> = {};
        for (const field of target) {
          if (field === 'slug') {
            errors['name'] = 'Ya existe';
            continue;
          }

          errors[field] = 'Ya existe';
        }

        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message:
            'Hay valores repetidos que ya existen asociados a tu cuenta o a nivel global',
          errors,
        });
      }
    }

    // Si es error conocido de Prisma
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Uno o más valores que se enviaron no cumplen el formatos requerido para ser almacenados',
        errors: null,
      });
    }

    // Error desconocido → Internal Server Error
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error inesperado del servidor',
      errors: null,
    });
  }
}
