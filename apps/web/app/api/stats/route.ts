import { NextResponse } from 'next/server';
import { csvDemoData } from '../../../lib/csv-demo-loader';

// GET - получение статистики
export async function GET() {
  try {
    const stats = await csvDemoData.getStats();
    
    return NextResponse.json({
      success: true,
      ...stats
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
