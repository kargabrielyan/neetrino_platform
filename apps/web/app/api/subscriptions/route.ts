import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

// GET /api/subscriptions - получить подписки
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    console.log('📥 [Next.js] GET /api/subscriptions:', queryString);
    
    const response = await fetch(`${API_BASE_URL}/subscriptions${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ [Next.js] Ошибка получения подписок:', error);
    return NextResponse.json(
      { 
        error: 'Backend service unavailable',
        message: 'Failed to get subscriptions'
      },
      { status: 503 }
    );
  }
}

// POST /api/subscriptions - создать подписку
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📥 [Next.js] POST /api/subscriptions:', body);
    
    const response = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('✅ [Next.js] Подписка создана:', data.id || 'ошибка');
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ [Next.js] Ошибка создания подписки:', error);
    return NextResponse.json(
      { 
        error: 'Backend service unavailable',
        message: 'Failed to create subscription'
      },
      { status: 503 }
    );
  }
}











