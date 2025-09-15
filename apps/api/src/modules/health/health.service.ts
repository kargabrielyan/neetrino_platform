import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        api: 'ok',
        database: 'ok', // TODO: добавить проверку БД
        redis: 'ok', // TODO: добавить проверку Redis
      },
    };
  }

  async ready() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  async live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
