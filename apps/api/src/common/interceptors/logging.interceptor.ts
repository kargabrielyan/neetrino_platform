import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response;
        const contentLength = response.get('content-length');
        const delay = Date.now() - now;

        this.logger.log(
          `${method} ${url} ${statusCode} ${contentLength || 0}b ${delay}ms - ${ip} - ${userAgent}`,
        );

        // Логируем медленные запросы
        if (delay > 1000) {
          this.logger.warn(
            `Slow request detected: ${method} ${url} took ${delay}ms`,
          );
        }
      }),
    );
  }
}
