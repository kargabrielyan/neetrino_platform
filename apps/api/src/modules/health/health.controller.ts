import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Проверка здоровья системы' })
  @ApiResponse({ status: 200, description: 'Статус всех компонентов системы' })
  async check() {
    return this.healthService.check();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Проверка готовности системы' })
  @ApiResponse({ status: 200, description: 'Готовность системы к работе' })
  async ready() {
    return this.healthService.ready();
  }

  @Get('live')
  @ApiOperation({ summary: 'Проверка жизнеспособности системы' })
  @ApiResponse({ status: 200, description: 'Система жива' })
  async live() {
    return this.healthService.live();
  }
}
