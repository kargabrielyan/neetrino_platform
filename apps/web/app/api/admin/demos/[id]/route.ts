import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - получить демо по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('📦 API: Получение демо:', id);

    const demo = await prisma.demo.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            website: true,
            logoUrl: true
          }
        }
      }
    });

    if (!demo) {
      return NextResponse.json(
        { success: false, error: 'Demo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: demo
    });
  } catch (error) {
    console.error('❌ Admin demo GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch demo' },
      { status: 500 }
    );
  }
}

// PUT - обновить демо
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('🔄 API: Обновление демо:', id);

    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.url !== undefined) updateData.url = body.url;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.subcategory !== undefined) updateData.subcategory = body.subcategory;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.regularPrice !== undefined) {
      updateData.regularPrice = body.regularPrice ? parseFloat(body.regularPrice) : null;
    }
    if (body.salePrice !== undefined) {
      updateData.salePrice = body.salePrice ? parseFloat(body.salePrice) : null;
    }

    const demo = await prisma.demo.update({
      where: { id },
      data: updateData,
      include: {
        vendor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log('✅ API: Демо обновлено:', demo.id);

    return NextResponse.json({
      success: true,
      data: demo,
      message: 'Demo updated successfully'
    });
  } catch (error) {
    console.error('❌ Admin demo PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update demo' },
      { status: 500 }
    );
  }
}

// DELETE - удалить демо
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🗑️ API: Удаление демо:', id);

    // Сначала проверим, нет ли связанных заказов или подписок
    const relatedOrders = await prisma.order.count({
      where: { demoId: id }
    });

    const relatedSubscriptions = await prisma.subscription.count({
      where: { demoId: id }
    });

    if (relatedOrders > 0 || relatedSubscriptions > 0) {
      // Вместо удаления помечаем как deleted
      await prisma.demo.update({
        where: { id },
        data: { status: 'deleted' }
      });

      console.log('⚠️ API: Демо помечено как deleted (есть связанные данные)');

      return NextResponse.json({
        success: true,
        message: 'Demo marked as deleted (has related orders/subscriptions)'
      });
    }

    await prisma.demo.delete({
      where: { id }
    });

    console.log('✅ API: Демо удалено:', id);

    return NextResponse.json({
      success: true,
      message: 'Demo deleted successfully'
    });
  } catch (error) {
    console.error('❌ Admin demo DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete demo' },
      { status: 500 }
    );
  }
}
