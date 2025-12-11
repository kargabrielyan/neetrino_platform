import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: any): Promise<Order> {
    return await this.prisma.order.create({
      data: {
        ...createOrderDto,
        deadline: createOrderDto.deadline ? new Date(createOrderDto.deadline) : null,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 20, status?: OrderStatus, assignedTo?: string, customerEmail?: string): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;
    if (customerEmail) where.customerEmail = { contains: customerEmail, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { demo: { include: { vendor: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { demo: { include: { vendor: true } } },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: any): Promise<Order> {
    await this.findOne(id);

    return await this.prisma.order.update({
      where: { id },
      data: {
        ...updateOrderDto,
        deadline: updateOrderDto.deadline ? new Date(updateOrderDto.deadline) : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.order.delete({ where: { id } });
  }

  async updateStatus(id: string, status: OrderStatus, notes?: string): Promise<Order> {
    await this.findOne(id);
    return await this.prisma.order.update({
      where: { id },
      data: { status, notes: notes || undefined },
    });
  }

  async getStatistics(): Promise<any> {
    const total = await this.prisma.order.count();

    const byStatusRaw = await this.prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    const byStatus = byStatusRaw.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    const recent = await this.prisma.order.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    });

    const avgBudget = await this.prisma.order.aggregate({
      _avg: { budget: true },
      where: { budget: { not: null } },
    });

    return {
      total,
      byStatus,
      recent,
      averageBudget: avgBudget._avg.budget || 0,
    };
  }
}
