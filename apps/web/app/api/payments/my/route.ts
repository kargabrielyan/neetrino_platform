import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

// GET /api/payments/my - получить мои платежи
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    
    console.log('📥 [Next.js] GET /api/payments/my:', { email, userId });
    
    // Определяем какой endpoint использовать
    let endpoint = `${API_BASE_URL}/payments`;
    if (userId) {
      endpoint = `${API_BASE_URL}/payments/my?userId=${encodeURIComponent(userId)}`;
    } else if (email) {
      endpoint = `${API_BASE_URL}/payments/by-email?email=${encodeURIComponent(email)}`;
    }
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ [Next.js] Ошибка получения платежей пользователя:', error);
    return NextResponse.json(
      { 
        error: 'Backend service unavailable',
        message: 'Не удалось получить платежи'
      },
      { status: 503 }
    );
  }
}

