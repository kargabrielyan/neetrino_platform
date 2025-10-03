import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma connected to database');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      // Не прерываем работу приложения, если БД недоступна
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Метод для проверки доступности БД
  async isConnected(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  // Метод для безопасного выполнения операций
  async safeExecute<T>(operation: () => Promise<T>): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      console.error('Prisma operation failed:', error);
      return null;
    }
  }
}
