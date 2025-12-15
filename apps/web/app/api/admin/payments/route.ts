import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - получить все платежи
export async function GET(request: NextRequest) {
  try {
    console.log('📦 API: Получение платежей...');
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    const status = searchParams.get('status');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Для поиска нужно искать через связанные таблицы
    if (search) {
      where.subscription = {
        OR: [
          { customerName: { contains: search, mode: 'insensitive' } },
          { customerEmail: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        subscription: {
          select: {
            id: true,
            customerName: true,
            customerEmail: true,
            demo: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    console.log('✅ API: Найдено платежей:', payments.length);

    return NextResponse.json({
      success: true,
      data: payments,
      total: payments.length
    });
  } catch (error) {
    console.error('❌ Admin payments GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}



