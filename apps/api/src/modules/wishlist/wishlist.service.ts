import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { Wishlist } from '@prisma/client';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  /**
   * Добавить товар в избранное
   */
  async add(demoId: string, userId?: string, userEmail?: string): Promise<Wishlist> {
    console.log('❤️ Добавление в избранное:', { demoId, userId, userEmail });

    // Проверяем существование демо
    const demo = await this.prisma.demo.findUnique({
      where: { id: demoId },
    });

    if (!demo) {
      throw new NotFoundException(`Продукт с ID ${demoId} не найден`);
    }

    // Проверяем, не добавлен ли уже
    const existing = await this.prisma.wishlist.findFirst({
      where: {
        demoId,
        OR: [
          { userId: userId || undefined },
          { userEmail: userEmail || undefined },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Товар уже в избранном');
    }

    // Добавляем в избранное
    const wishlistItem = await this.prisma.wishlist.create({
      data: {
        demoId,
        userId: userId || null,
        userEmail: userEmail || null,
      },
      include: {
        demo: {
          include: { vendor: true },
        },
      },
    });

    console.log('✅ Добавлено в избранное:', wishlistItem.id);
    return wishlistItem;
  }

  /**
   * Удалить товар из избранного
   */
  async remove(demoId: string, userId?: string, userEmail?: string): Promise<void> {
    console.log('💔 Удаление из избранного:', { demoId, userId, userEmail });

    const wishlistItem = await this.prisma.wishlist.findFirst({
      where: {
        demoId,
        OR: [
          { userId: userId || undefined },
          { userEmail: userEmail || undefined },
        ],
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Товар не найден в избранном');
    }

    await this.prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });

    console.log('✅ Удалено из избранного');
  }

  /**
   * Переключить состояние избранного (добавить/удалить)
   */
  async toggle(demoId: string, userId?: string, userEmail?: string): Promise<{ added: boolean; item?: Wishlist }> {
    console.log('🔄 Переключение избранного:', { demoId, userId, userEmail });

    const existing = await this.prisma.wishlist.findFirst({
      where: {
        demoId,
        OR: [
          { userId: userId || undefined },
          { userEmail: userEmail || undefined },
        ],
      },
    });

    if (existing) {
      await this.prisma.wishlist.delete({
        where: { id: existing.id },
      });
      console.log('💔 Удалено из избранного');
      return { added: false };
    } else {
      const item = await this.add(demoId, userId, userEmail);
      return { added: true, item };
    }
  }

  /**
   * Получить избранное пользователя
   */
  async findByUser(
    userId?: string,
    userEmail?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Wishlist[]; total: number; page: number; limit: number }> {
    const where: any = {
      OR: [],
    };

    if (userId) {
      where.OR.push({ userId });
    }
    if (userEmail) {
      where.OR.push({ userEmail });
    }

    if (where.OR.length === 0) {
      return { data: [], total: 0, page, limit };
    }

    const [data, total] = await Promise.all([
      this.prisma.wishlist.findMany({
        where,
        include: {
          demo: {
            include: { vendor: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wishlist.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Получить ID товаров в избранном (для быстрой проверки)
   */
  async getIds(userId?: string, userEmail?: string): Promise<string[]> {
    const where: any = {
      OR: [],
    };

    if (userId) {
      where.OR.push({ userId });
    }
    if (userEmail) {
      where.OR.push({ userEmail });
    }

    if (where.OR.length === 0) {
      return [];
    }

    const items = await this.prisma.wishlist.findMany({
      where,
      select: { demoId: true },
    });

    return items.map(item => item.demoId);
  }

  /**
   * Проверить, есть ли товар в избранном
   */
  async isInWishlist(demoId: string, userId?: string, userEmail?: string): Promise<boolean> {
    const where: any = {
      demoId,
      OR: [],
    };

    if (userId) {
      where.OR.push({ userId });
    }
    if (userEmail) {
      where.OR.push({ userEmail });
    }

    if (where.OR.length === 0) {
      return false;
    }

    const count = await this.prisma.wishlist.count({ where });
    return count > 0;
  }

  /**
   * Получить количество товаров в избранном
   */
  async getCount(userId?: string, userEmail?: string): Promise<number> {
    const where: any = {
      OR: [],
    };

    if (userId) {
      where.OR.push({ userId });
    }
    if (userEmail) {
      where.OR.push({ userEmail });
    }

    if (where.OR.length === 0) {
      return 0;
    }

    return await this.prisma.wishlist.count({ where });
  }
}
















