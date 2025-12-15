import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - получить платёж по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('📦 API: Получение платежа:', id);

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        subscription: {
          select: {
            id: true,
            customerName: true,
            customerEmail: true,
            demo: {
              select: {
                id: true,
                title: true,
                url: true
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
      }
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('❌ Admin payment GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}

// PUT - обновить платёж
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('🔄 API: Обновление платежа:', id);

    const updateData: any = {};
    
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === 'SUCCESS') {
        updateData.paidAt = new Date();
      }
    }
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod;

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        subscription: {
          select: {
            id: true,
            customerName: true
          }
        }
      }
    });

    // Если платёж успешный, обновляем количество оплаченных месяцев в подписке
    if (body.status === 'SUCCESS' && payment.subscriptionId) {
      await prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: {
          paidMonths: { increment: 1 }
        }
      });
    }

    console.log('✅ API: Платёж обновлён:', payment.id);

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Payment updated successfully'
    });
  } catch (error) {
    console.error('❌ Admin payment PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}




