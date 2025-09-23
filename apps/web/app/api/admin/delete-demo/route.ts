import { NextRequest, NextResponse } from 'next/server';
const { demoData } = require('../../../../lib/demo-data.js');

// DELETE - удалить демо
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('🗑️ Delete Demo API: Начинаем удаление демо с ID:', id);
    
    // Получаем демо перед удалением
    const demoToDelete = demoData.getById(id);
    if (!demoToDelete) {
      console.log('❌ Delete Demo API: Демо не найдено');
      return NextResponse.json(
        { success: false, error: 'Demo not found' },
        { status: 404 }
      );
    }
    
    console.log('🗑️ Delete Demo API: Удаляем демо:', demoToDelete.title);
    
    // Удаляем демо
    const success = demoData.delete(id);
    
    if (!success) {
      console.log('❌ Delete Demo API: Ошибка при удалении');
      return NextResponse.json(
        { success: false, error: 'Failed to delete demo' },
        { status: 500 }
      );
    }
    
    console.log('✅ Delete Demo API: Демо успешно удалено');
    
    return NextResponse.json({
      success: true,
      message: 'Demo deleted successfully',
      deletedDemo: demoToDelete,
      remainingCount: demoData.getAll().length
    });
  } catch (error) {
    console.error('💥 Delete Demo API: Критическая ошибка при удалении:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete demo' },
      { status: 500 }
    );
  }
}
