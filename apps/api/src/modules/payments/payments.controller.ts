import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { UpdatePaymentStatusDto } from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все платежи (админ)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'subscriptionId', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: PaymentStatus,
    @Query('subscriptionId') subscriptionId?: string,
  ) {
    console.log('📥 GET /payments:', { page, limit, status, subscriptionId });
    return await this.paymentsService.findAll(page, limit, status, subscriptionId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Получить мои платежи по userId' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMy(
    @Query('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    console.log('📥 GET /payments/my:', { userId, page, limit });
    return await this.paymentsService.findByUser(userId, page, limit);
  }

  @Get('by-email')
  @ApiOperation({ summary: 'Получить платежи по email' })
  @ApiQuery({ name: 'email', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByEmail(
    @Query('email') email: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    console.log('📥 GET /payments/by-email:', { email, page, limit });
    return await this.paymentsService.findByEmail(email, page, limit);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Получить статистику платежей' })
  async getStatistics() {
    console.log('📥 GET /payments/statistics');
    return await this.paymentsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить платёж по ID' })
  @ApiParam({ name: 'id', description: 'ID платежа' })
  async findOne(@Param('id') id: string) {
    console.log('📥 GET /payments/:id:', id);
    return await this.paymentsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Обновить статус платежа (админ)' })
  @ApiParam({ name: 'id', description: 'ID платежа' })
  @ApiBody({ type: UpdatePaymentStatusDto })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdatePaymentStatusDto) {
    console.log('📥 PATCH /payments/:id/status:', id, dto);
    return await this.paymentsService.updateStatus(id, dto);
  }
}















