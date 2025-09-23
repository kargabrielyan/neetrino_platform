import { NextRequest, NextResponse } from 'next/server';
const { demoData } = require('../../../../lib/demo-data.js');

// GET - получить все демо
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    const status = searchParams.get('status');

    // Используем общий модуль для поиска
    const filteredDemos = demoData.search(search || '', {
      status: status || undefined,
    });

    return NextResponse.json({
      success: true,
      data: filteredDemos,
      total: filteredDemos.length
    });
  } catch (error) {
    console.error('Admin demos GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch demos' },
      { status: 500 }
    );
  }
}

// POST - создать новое демо
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newDemo = demoData.create({
      title: body.title,
      description: body.description,
      url: body.url,
      status: body.status,
      category: body.category,
      subcategory: body.subcategory,
      imageUrl: body.imageUrl,
      vendor: {
        name: body.vendorName,
        website: body.vendorWebsite,
        logoUrl: body.vendorLogoUrl,
      }
    });

    return NextResponse.json({
      success: true,
      data: newDemo,
      message: 'Demo created successfully'
    });
  } catch (error) {
    console.error('Admin demos POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create demo' },
      { status: 500 }
    );
  }
}
