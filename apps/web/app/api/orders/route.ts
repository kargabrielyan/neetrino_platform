import { NextRequest, NextResponse } from 'next/server';
import { createOrderSchema } from '@/lib/validations/order';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const response = await fetch(`${API_BASE_URL}/orders${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ [ORDERS API] GET error:', error);
    return NextResponse.json(
      { 
        error: 'Backend service unavailable',
        message: 'Failed to fetch orders'
      },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Валидация входных данных перед отправкой в backend
    const validationResult = createOrderSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('❌ [ORDERS API] Validation error:', validationResult.error.issues);
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid order data',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Отправляем валидированные данные в backend
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validationResult.data),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ [ORDERS API] POST error:', error);
    return NextResponse.json(
      { 
        error: 'Backend service unavailable',
        message: 'Failed to create order'
      },
      { status: 503 }
    );
  }
}
