import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { Payment, PaymentStatus, SubscriptionStatus } from '@prisma/client';
import { UpdatePaymentStatusDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Получить все платежи (для админа)
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: PaymentStatus,
    subscriptionId?: string,
  ): Promise<{ data: Payment[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    if (subscriptionId) where.subscriptionId = subscriptionId;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          subscription: {
            include: {
              demo: true,
            },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Получить платежи пользователя
   */
  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Payment[]; total: number; page: number; limit: number }> {
    const where = { userId };

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          subscription: {
            include: {
              demo: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Получить платежи по email
   */
  async findByEmail(
    email: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Payment[]; total: number; page: number; limit: number }> {
    // Сначала найдём пользователя по email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { data: [], total: 0, page, limit };
    }

    return this.findByUser(user.id, page, limit);
  }

  /**
   * Получить платёж по ID
   */
  async findOne(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            demo: { include: { vendor: true } },
          },
        },
        user: true,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Платёж с ID ${id} не найден`);
    }

    return payment;
  }

  /**
   * Обновить статус платежа (для админа)
   */
  async updateStatus(id: string, dto: UpdatePaymentStatusDto): Promise<Payment> {
    const payment = await this.findOne(id);

    console.log('💳 Обновление статуса платежа:', id, dto.status);

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: dto.status,
        paidAt: dto.status === PaymentStatus.SUCCESS ? new Date() : payment.paidAt,
        notes: dto.notes || payment.notes,
      },
      include: {
        subscription: true,
      },
    });

    // Если платёж успешен, обновляем подписку
    if (dto.status === PaymentStatus.SUCCESS) {
      const subscription = updatedPayment.subscription;
      const newPaidMonths = payment.monthNumber;

      const isCompleted = newPaidMonths >= subscription.totalMonths;
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          paidMonths: newPaidMonths,
          status: isCompleted ? SubscriptionStatus.COMPLETED : SubscriptionStatus.ACTIVE,
          completedAt: isCompleted ? new Date() : null,
          nextBillingDate: isCompleted ? null : nextBillingDate,
        },
      });

      console.log('✅ Подписка обновлена, оплачено месяцев:', newPaidMonths);
    }

    return updatedPayment;
  }

  /**
   * Получить статистику по платежам
   */
  async getStatistics(): Promise<any> {
    const total = await this.prisma.payment.count();

    const byStatusRaw = await this.prisma.payment.groupBy({
      by: ['status'],
      _count: true,
      _sum: { amount: true },
    });

    const byStatus = byStatusRaw.reduce((acc, item) => {
      acc[item.status] = {
        count: item._count,
        amount: item._sum.amount || 0,
      };
      return acc;
    }, {} as Record<string, { count: number; amount: any }>);

    const thisMonth = await this.prisma.payment.aggregate({
      _count: true,
      _sum: { amount: true },
      where: {
        status: PaymentStatus.SUCCESS,
        paidAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return {
      total,
      byStatus,
      thisMonth: {
        count: thisMonth._count,
        amount: thisMonth._sum.amount || 0,
      },
    };
  }
}
















