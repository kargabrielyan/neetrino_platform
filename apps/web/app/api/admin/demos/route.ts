import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - получить все демо
export async function GET(request: NextRequest) {
  try {
    console.log('📦 API: Получение демо...');
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    const status = searchParams.get('status');

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const demos = await prisma.demo.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            website: true,
            logoUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    console.log('✅ API: Найдено демо:', demos.length);

    return NextResponse.json({
      success: true,
      data: demos,
      total: demos.length
    });
  } catch (error) {
    console.error('❌ Admin demos GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch demos' },
      { status: 500 }
    );
  }
}

// POST - создать новое демо
export async function POST(request: NextRequest) {
  try {
    console.log('➕ API: Создание демо...');
    const body = await request.json();

    // Сначала найдём или создадим вендора
    let vendor = await prisma.vendor.findFirst({
      where: { name: body.vendorName || 'Default' }
    });

    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: {
          name: body.vendorName || 'Default',
          website: body.vendorWebsite || '',
          logoUrl: body.vendorLogoUrl || ''
        }
      });
    }

    const demo = await prisma.demo.create({
      data: {
        title: body.title,
        description: body.description || '',
        url: body.url,
        status: body.status || 'active',
        category: body.category || '',
        subcategory: body.subcategory || '',
        imageUrl: body.imageUrl || '',
        regularPrice: body.regularPrice ? parseFloat(body.regularPrice) : null,
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        vendorId: vendor.id
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log('✅ API: Демо создано:', demo.id);

    return NextResponse.json({
      success: true,
      data: demo,
      message: 'Demo created successfully'
    });
  } catch (error) {
    console.error('❌ Admin demos POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create demo' },
      { status: 500 }
    );
  }
}
