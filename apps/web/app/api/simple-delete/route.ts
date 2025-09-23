import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Simple DELETE endpoint called');
    
    return NextResponse.json({
      success: true,
      message: 'Simple delete successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('💥 Simple DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Simple delete failed' },
      { status: 500 }
    );
  }
}
