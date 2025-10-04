import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ message: string; statusCode: number; data: T }> {
    const successMessage =
      this.reflector.get<string>(SUCCESS_MESSAGE_KEY, context.getHandler()) ||
      'Operación exitosa';

    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return {
          message: successMessage,
          statusCode,
          data,
        };
      }),

      catchError((err) => {
        throw err; // deja que tu GlobalExceptionFilter lo maneje
      }),
    );
  }
}
