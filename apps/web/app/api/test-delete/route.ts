import { NextRequest, NextResponse } from 'next/server';

// Простой тест удаления
export async function DELETE(request: NextRequest) {
  try {
    console.log('🧪 Test DELETE endpoint called');
    
    // Имитируем удаление
    const result = {
      success: true,
      message: 'Test delete successful',
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Test result:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('💥 Test DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Test delete failed' },
      { status: 500 }
    );
  }
}
