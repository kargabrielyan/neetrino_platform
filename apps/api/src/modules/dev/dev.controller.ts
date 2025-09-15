import { Controller, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DevService } from './dev.service';

@ApiTags('dev')
@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Post('seed')
  @ApiOperation({ summary: 'Seed database with test data' })
  async seedDatabase() {
    return this.devService.seedDatabase();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get development status' })
  async getStatus() {
    return this.devService.getStatus();
  }
}
