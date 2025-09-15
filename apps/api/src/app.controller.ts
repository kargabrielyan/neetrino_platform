import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Главная страница API' })
  @ApiResponse({ status: 200, description: 'Информация о API' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Проверка здоровья API' })
  @ApiResponse({ status: 200, description: 'Статус API' })
  getHealth() {
    return this.appService.getHealth();
  }
}
