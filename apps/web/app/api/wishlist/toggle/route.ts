import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

// POST /api/wishlist/toggle - переключить избранное
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📥 [Next.js] POST /api/wishlist/toggle:', body);
    
    const response = await fetch(`${API_BASE_URL}/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('✅ [Next.js] Wishlist toggle:', data.added ? 'добавлено' : 'удалено');
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ [Next.js] Ошибка переключения избранного:', error);
    return NextResponse.json(
      { 
        error: 'Backend service unavailable',
        message: 'Failed to update wishlist'
      },
      { status: 503 }
    );
  }
}











