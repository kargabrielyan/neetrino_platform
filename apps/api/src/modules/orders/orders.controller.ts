import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'assignedTo', required: false, type: String, description: 'Filter by assigned person' })
  @ApiQuery({ name: 'customerEmail', required: false, type: String, description: 'Filter by customer email' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
    @Query('assignedTo') assignedTo?: string,
    @Query('customerEmail') customerEmail?: string,
  ) {
    return this.ordersService.findAll(page, limit, status, assignedTo, customerEmail);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStatistics() {
    return this.ordersService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('notes') notes?: string,
  ) {
    return this.ordersService.updateStatus(id, status, notes);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
