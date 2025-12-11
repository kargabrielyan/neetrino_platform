import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CancelSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionStatus } from '@prisma/client';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую подписку' })
  @ApiBody({ type: CreateSubscriptionDto })
  async create(@Body() dto: CreateSubscriptionDto) {
    console.log('📥 POST /subscriptions:', dto);
    return await this.subscriptionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все подписки (админ)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: SubscriptionStatus })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: SubscriptionStatus,
  ) {
    console.log('📥 GET /subscriptions:', { page, limit, status });
    return await this.subscriptionsService.findAll(page, limit, status);
  }

  @Get('my')
  @ApiOperation({ summary: 'Получить мои подписки по userId' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMy(
    @Query('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    console.log('📥 GET /subscriptions/my:', { userId, page, limit });
    return await this.subscriptionsService.findByUser(userId, page, limit);
  }

  @Get('by-email')
  @ApiOperation({ summary: 'Получить подписки по email' })
  @ApiQuery({ name: 'email', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByEmail(
    @Query('email') email: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    console.log('📥 GET /subscriptions/by-email:', { email, page, limit });
    return await this.subscriptionsService.findByEmail(email, page, limit);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Получить статистику подписок' })
  async getStatistics() {
    console.log('📥 GET /subscriptions/statistics');
    return await this.subscriptionsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить подписку по ID' })
  @ApiParam({ name: 'id', description: 'ID подписки' })
  async findOne(@Param('id') id: string) {
    console.log('📥 GET /subscriptions/:id:', id);
    return await this.subscriptionsService.findOne(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Отменить подписку' })
  @ApiParam({ name: 'id', description: 'ID подписки' })
  @ApiBody({ type: CancelSubscriptionDto, required: false })
  async cancel(@Param('id') id: string, @Body() dto?: CancelSubscriptionDto) {
    console.log('📥 PATCH /subscriptions/:id/cancel:', id, dto);
    return await this.subscriptionsService.cancel(id, dto);
  }

  @Post(':id/simulate-payment')
  @ApiOperation({ summary: 'Симуляция следующего платежа (для тестирования)' })
  @ApiParam({ name: 'id', description: 'ID подписки' })
  async simulatePayment(@Param('id') id: string) {
    console.log('📥 POST /subscriptions/:id/simulate-payment:', id);
    return await this.subscriptionsService.simulatePayment(id);
  }
}











