import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  public requests = new Map<string, { count: number; resetTime: number }>();

  constructor(public config: RateLimitConfig) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = this.getKey(request);
    const now = Date.now();

    // Очищаем старые записи
    this.cleanup();

    const current = this.requests.get(key);

    if (!current) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (now > current.resetTime) {
      // Окно времени истекло, сбрасываем счетчик
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (current.count >= this.config.max) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: this.config.message || 'Too many requests',
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count++;
    return true;
  }

  public getKey(request: Request): string {
    // Используем IP адрес как ключ
    return request.ip || 'unknown';
  }

  public cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Фабрика для создания guard с конфигурацией
export function createRateLimitGuard(config: RateLimitConfig) {
  return class extends RateLimitGuard {
    public constructor() {
      super(config);
    }
  };
}
