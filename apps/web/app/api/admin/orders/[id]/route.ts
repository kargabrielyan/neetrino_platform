import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - получить заказ по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('📦 API: Получение заказа:', id);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        demo: {
          select: {
            id: true,
            title: true,
            url: true,
            imageUrl: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Admin order GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT - обновить заказ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('🔄 API: Обновление заказа:', id);

    const updateData: any = {};
    
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo;
    if (body.deadline !== undefined) updateData.deadline = body.deadline ? new Date(body.deadline) : null;

    const order = await prisma.order.update({
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

    console.log('✅ API: Заказ обновлён:', order.id);

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('❌ Admin order PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - удалить заказ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🗑️ API: Удаление заказа:', id);

    await prisma.order.delete({
      where: { id }
    });

    console.log('✅ API: Заказ удалён:', id);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('❌ Admin order DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}



