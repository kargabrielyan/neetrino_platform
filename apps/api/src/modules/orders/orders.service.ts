import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create({
      ...createOrderDto,
      deadline: createOrderDto.deadline ? new Date(createOrderDto.deadline) : null,
    });
    
    return await this.ordersRepository.save(order);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: OrderStatus,
    assignedTo?: string,
    customerEmail?: string,
  ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.demo', 'demo')
      .leftJoinAndSelect('demo.vendor', 'vendor');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (assignedTo) {
      queryBuilder.andWhere('order.assignedTo = :assignedTo', { assignedTo });
    }

    if (customerEmail) {
      queryBuilder.andWhere('order.customerEmail ILIKE :email', { email: `%${customerEmail}%` });
    }

    const [data, total] = await queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['demo', 'demo.vendor'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    Object.assign(order, {
      ...updateOrderDto,
      deadline: updateOrderDto.deadline ? new Date(updateOrderDto.deadline) : order.deadline,
    });

    return await this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  async updateStatus(id: string, status: OrderStatus, notes?: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    if (notes) {
      order.notes = notes;
    }
    return await this.ordersRepository.save(order);
  }

  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<OrderStatus, number>;
    recent: number;
    averageBudget: number;
  }> {
    const total = await this.ordersRepository.count();
    
    const byStatus = await this.ordersRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const statusCounts = byStatus.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {} as Record<OrderStatus, number>);

    // Заполняем нулями для статусов без заказов
    Object.values(OrderStatus).forEach(status => {
      if (!statusCounts[status]) {
        statusCounts[status] = 0;
      }
    });

    const recent = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.createdAt >= :date', { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) })
      .getCount();

    const avgBudgetResult = await this.ordersRepository
      .createQueryBuilder('order')
      .select('AVG(order.budget)', 'avg')
      .where('order.budget IS NOT NULL')
      .getRawOne();

    const averageBudget = avgBudgetResult?.avg ? parseFloat(avgBudgetResult.avg) : 0;

    return {
      total,
      byStatus: statusCounts,
      recent,
      averageBudget,
    };
  }
}
