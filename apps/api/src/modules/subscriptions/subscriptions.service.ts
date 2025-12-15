import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { Subscription, SubscriptionStatus, PaymentStatus, Prisma } from '@prisma/client';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CancelSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создать новую подписку
   * Логика: полная цена / 10 = ежемесячный платёж × 10 месяцев
   */
  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    console.log('📝 Создание подписки:', dto);

    // Получаем демо/продукт
    const demo = await this.prisma.demo.findUnique({
      where: { id: dto.demoId },
    });

    if (!demo) {
      throw new NotFoundException(`Продукт с ID ${dto.demoId} не найден`);
    }

    // Рассчитываем цены
    const fullPrice = demo.regularPrice || demo.salePrice || new Prisma.Decimal(0);
    if (fullPrice.equals(0)) {
      throw new BadRequestException('Продукт не имеет цены');
    }

    const monthlyPrice = fullPrice.dividedBy(10);
    const startDate = new Date();
    const nextBillingDate = new Date(startDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    // Если userId не передан, создаём или находим пользователя по email
    let userId = dto.userId;
    if (!userId) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.customerEmail },
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Создаём нового пользователя
        const newUser = await this.prisma.user.create({
          data: {
            email: dto.customerEmail,
            name: dto.customerName,
            phone: dto.customerPhone,
            role: 'USER',
          },
        });
        userId = newUser.id;
        console.log('👤 Создан новый пользователь:', newUser.email);
      }
    }

    // Создаём подписку
    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        demoId: dto.demoId,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        fullPrice,
        monthlyPrice,
        currency: 'AMD',
        totalMonths: 10,
        paidMonths: 0,
        status: SubscriptionStatus.PENDING,
        startDate,
        nextBillingDate,
        notes: dto.notes,
      },
      include: {
        demo: true,
        user: true,
      },
    });

    console.log('✅ Подписка создана:', subscription.id);

    // Создаём первый платёж (симуляция)
    const firstPayment = await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        userId,
        amount: monthlyPrice,
        currency: 'AMD',
        status: PaymentStatus.SUCCESS, // Симуляция успешной оплаты
        monthNumber: 1,
        paidAt: new Date(),
        dueDate: startDate,
        paymentMethod: 'simulation',
        notes: 'Первый платёж (симуляция)',
      },
    });

    console.log('💰 Первый платёж создан:', firstPayment.id);

    // Обновляем подписку - теперь она активна
    const updatedSubscription = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
        paidMonths: 1,
      },
      include: {
        demo: true,
        user: true,
        payments: true,
      },
    });

    return updatedSubscription;
  }

  /**
   * Получить все подписки (для админа)
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: SubscriptionStatus,
  ): Promise<{ data: Subscription[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        include: {
          demo: { include: { vendor: true } },
          user: true,
          payments: { orderBy: { monthNumber: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Получить подписки пользователя
   */
  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Subscription[]; total: number; page: number; limit: number }> {
    const where = { userId };

    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        include: {
          demo: { include: { vendor: true } },
          payments: { orderBy: { monthNumber: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Получить подписки по email (для неавторизованных)
   */
  async findByEmail(
    email: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Subscription[]; total: number; page: number; limit: number }> {
    const where = { customerEmail: email };

    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        include: {
          demo: { include: { vendor: true } },
          payments: { orderBy: { monthNumber: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Получить одну подписку
   */
  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        demo: { include: { vendor: true } },
        user: true,
        payments: { orderBy: { monthNumber: 'asc' } },
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Подписка с ID ${id} не найдена`);
    }

    return subscription;
  }

  /**
   * Отменить подписку
   */
  async cancel(id: string, dto?: CancelSubscriptionDto): Promise<Subscription> {
    const subscription = await this.findOne(id);

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Подписка уже отменена');
    }

    if (subscription.status === SubscriptionStatus.COMPLETED) {
      throw new BadRequestException('Подписка уже завершена');
    }

    console.log('❌ Отмена подписки:', id);

    return await this.prisma.subscription.update({
      where: { id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
        notes: dto?.reason ? `Причина отмены: ${dto.reason}` : subscription.notes,
      },
      include: {
        demo: true,
        user: true,
        payments: true,
      },
    });
  }

  /**
   * Симуляция следующего платежа (для тестирования)
   */
  async simulatePayment(subscriptionId: string): Promise<Subscription> {
    const subscription = await this.findOne(subscriptionId);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Подписка не активна');
    }

    if (subscription.paidMonths >= subscription.totalMonths) {
      throw new BadRequestException('Все платежи уже выполнены');
    }

    const nextMonthNumber = subscription.paidMonths + 1;

    // Создаём платёж
    await this.prisma.payment.create({
      data: {
        subscriptionId,
        userId: subscription.userId,
        amount: subscription.monthlyPrice,
        currency: subscription.currency,
        status: PaymentStatus.SUCCESS,
        monthNumber: nextMonthNumber,
        paidAt: new Date(),
        paymentMethod: 'simulation',
        notes: `Платёж за месяц ${nextMonthNumber}`,
      },
    });

    // Обновляем подписку
    const isCompleted = nextMonthNumber >= subscription.totalMonths;
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    return await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        paidMonths: nextMonthNumber,
        status: isCompleted ? SubscriptionStatus.COMPLETED : SubscriptionStatus.ACTIVE,
        completedAt: isCompleted ? new Date() : null,
        nextBillingDate: isCompleted ? null : nextBillingDate,
      },
      include: {
        demo: true,
        payments: true,
      },
    });
  }

  /**
   * Получить статистику по подпискам
   */
  async getStatistics(): Promise<any> {
    const total = await this.prisma.subscription.count();

    const byStatusRaw = await this.prisma.subscription.groupBy({
      by: ['status'],
      _count: true,
    });

    const byStatus = byStatusRaw.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    const totalRevenue = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.SUCCESS },
    });

    const thisMonth = await this.prisma.subscription.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return {
      total,
      byStatus,
      thisMonth,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  }
}
















