import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

// PATCH /api/subscriptions/[id]/cancel - отменить подписку
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    
    console.log('📥 [Next.js] PATCH /api/subscriptions/' + id + '/cancel:', body);
    
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('✅ [Next.js] Подписка отменена:', id);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ [Next.js] Ошибка отмены подписки:', error);
    return NextResponse.json(
      { 
        error: 'Backend service unavailable',
        message: 'Не удалось отменить подписку'
      },
      { status: 503 }
    );
  }
}











