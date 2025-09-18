import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { Demo } from '../demos/demo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Demo]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
