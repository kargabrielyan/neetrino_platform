import { PrismaClient } from '@prisma/client';

// Singleton паттерн для Prisma Client
// Предотвращает создание множественных подключений к БД

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | undefined = undefined;

// Функция для получения или создания Prisma Client
function getPrismaClient(): PrismaClient | undefined {
  // Если уже создан, возвращаем его
  if (prismaInstance) {
    return prismaInstance;
  }

  // Проверяем наличие DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ [Prisma] DATABASE_URL не установлен в переменных окружения');
    console.error('❌ [Prisma] Доступные env переменные:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
    return undefined;
  }

  try {
    console.log('🔵 [Prisma] Создание Prisma Client...');
    console.log('🔵 [Prisma] DATABASE_URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Скрываем пароль

    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

    // В development сохраняем в global для переиспользования
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }

    console.log('✅ [Prisma] Prisma Client создан успешно');
    return prismaInstance;
  } catch (error: any) {
    console.error('❌ [Prisma] Ошибка создания Prisma Client:', error);
    console.error('❌ [Prisma] Детали:', {
      message: error?.message,
      code: error?.code,
      name: error?.name
    });
    return undefined;
  }
}

// Экспортируем функцию для получения Prisma Client
export { getPrismaClient };

// Экспортируем Prisma Client (создается при первом импорте, если DATABASE_URL доступен)
export const prisma = getPrismaClient();

