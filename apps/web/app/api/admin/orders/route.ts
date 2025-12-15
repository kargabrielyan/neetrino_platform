import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - получить все заказы
export async function GET(request: NextRequest) {
  try {
    console.log('📦 API: Получение заказов...');
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

    const orders = await prisma.order.findMany({
      where,
      include: {
        demo: {
          select: {
            id: true,
            title: true,
            url: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    console.log('✅ API: Найдено заказов:', orders.length);

    return NextResponse.json({
      success: true,
      data: orders,
      total: orders.length
    });
  } catch (error) {
    console.error('❌ Admin orders GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - создать новый заказ
export async function POST(request: NextRequest) {
  try {
    console.log('➕ API: Создание заказа...');
    const body = await request.json();
    
    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        demoId: body.demoId,
        requirements: body.requirements,
        budget: body.budget ? parseFloat(body.budget) : null,
        status: body.status || 'NEW',
        notes: body.notes
      },
      include: {
        demo: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    console.log('✅ API: Заказ создан:', order.id);

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('❌ Admin orders POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}



