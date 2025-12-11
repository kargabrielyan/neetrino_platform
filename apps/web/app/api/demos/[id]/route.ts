import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

/**
 * GET /api/demos/[id] - получить демо по ID или SKU
 * 
 * Просто пробрасывает запрос в NestJS API.
 * demos.service.findOne() уже умеет искать по UUID, SKU и metadata.sku
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Декодируем ID из URL (на случай если он был закодирован)
    let decodedId: string;
    try {
      decodedId = decodeURIComponent(id).trim();
    } catch {
      decodedId = String(id).trim();
    }

    console.log('[API /api/demos/[id]] id =', decodedId);
    console.log('[API /api/demos/[id]] id type:', typeof decodedId);
    console.log('[API /api/demos/[id]] id length:', decodedId.length);

    // Пробрасываем запрос в NestJS API
    const nestUrl = `${API_URL}/demos/${encodeURIComponent(decodedId)}`;
    console.log('[API /api/demos/[id]] fetching from NestJS:', nestUrl);
    
    const res = await fetch(nestUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[API /api/demos/[id]] NestJS response status:', res.status);

    // Если 404 - товар не найден
    if (res.status === 404) {
      const errorText = await res.text().catch(() => '');
      console.log('[API /api/demos/[id]] 404 from NestJS:', errorText);
      return NextResponse.json(
        { 
          error: 'Demo not found',
          message: `Товар с ID "${decodedId}" не найден в базе данных.`,
          id: decodedId
        },
        { status: 404 }
      );
    }

    // Если другая ошибка
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      console.error('[API /api/demos/[id]] NestJS API error:', res.status, errorText);
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: 'Error fetching product',
          id: decodedId,
          details: process.env.NODE_ENV === 'development' ? errorText : undefined
        },
        { status: 500 }
      );
    }

    // Успешный ответ
    const data = await res.json();
    console.log('[API /api/demos/[id]] ✅ success, returning data');
    console.log('[API /api/demos/[id]] data.id:', data.id);
    console.log('[API /api/demos/[id]] data.sku:', data.sku);
    console.log('[API /api/demos/[id]] data.title:', data.title);
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('❌ [Next.js API] Неожиданная ошибка:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

