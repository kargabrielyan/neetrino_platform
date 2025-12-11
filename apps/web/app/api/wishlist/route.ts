import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

// GET /api/wishlist - получить избранное
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    console.log('📥 [Next.js] GET /api/wishlist:', queryString);
    
    const response = await fetch(`${API_BASE_URL}/wishlist${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ [Next.js] Ошибка получения избранного:', error);
    return NextResponse.json(
      { 
        error: 'Backend service unavailable',
        message: 'Failed to get wishlist'
      },
      { status: 503 }
    );
  }
}











