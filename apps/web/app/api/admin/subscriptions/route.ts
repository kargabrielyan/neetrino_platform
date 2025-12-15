import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - получить все подписки
export async function GET(request: NextRequest) {
  try {
    console.log('📦 API: Получение подписок...');
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    const status = searchParams.get('status');

    const where: any = {};

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        demo: {
          select: {
            id: true,
            title: true,
            url: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        payments: {
          orderBy: { monthNumber: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    console.log('✅ API: Найдено подписок:', subscriptions.length);

    return NextResponse.json({
      success: true,
      data: subscriptions,
      total: subscriptions.length
    });
  } catch (error) {
    console.error('❌ Admin subscriptions GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}



