import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

// POST - отменить подписку
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🚫 API: Отмена подписки:', id);

    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
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

    console.log('✅ API: Подписка отменена:', subscription.id);

    return NextResponse.json({
      success: true,
      data: subscription,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('❌ Admin subscription cancel error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}




