import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - получить подписку по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('📦 API: Получение подписки:', id);

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        demo: {
          select: {
            id: true,
            title: true,
            url: true,
            imageUrl: true
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
          orderBy: { monthNumber: 'asc' }
        }
      }
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('❌ Admin subscription GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

// PUT - обновить подписку
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('🔄 API: Обновление подписки:', id);

    const updateData: any = {};
    
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.nextBillingDate !== undefined) {
      updateData.nextBillingDate = body.nextBillingDate ? new Date(body.nextBillingDate) : null;
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
      include: {
        demo: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    console.log('✅ API: Подписка обновлена:', subscription.id);

    return NextResponse.json({
      success: true,
      data: subscription,
      message: 'Subscription updated successfully'
    });
  } catch (error) {
    console.error('❌ Admin subscription PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}



