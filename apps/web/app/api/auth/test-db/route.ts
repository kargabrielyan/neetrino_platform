import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 [TEST-DB] Проверка подключения к базе данных');
    console.log('🔵 [TEST-DB] DATABASE_URL:', process.env.DATABASE_URL ? 'установлен' : 'НЕ установлен');
    console.log('🔵 [TEST-DB] Prisma:', prisma ? 'инициализирован' : 'НЕ инициализирован');
    
    if (!prisma) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Prisma клиент не инициализирован',
          hasDatabaseUrl: !!process.env.DATABASE_URL
        },
        { status: 500 }
      );
    }

    // Проверяем подключение
    await prisma.$connect();
    console.log('✅ [TEST-DB] Подключение установлено');

    // Простой запрос
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ [TEST-DB] Запрос выполнен:', result);

    return NextResponse.json(
      { 
        success: true,
        message: 'Database available',
        connected: true,
        testQuery: result
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [TEST-DB] Ошибка:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error?.message || 'Connection error',
        code: error?.code,
        name: error?.name,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      { status: 500 }
    );
  }
}




