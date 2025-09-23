import { NextRequest, NextResponse } from 'next/server';

// Простые тестовые данные прямо в файле
let demos = [
  {
    id: '1',
    title: 'E-commerce Store',
    description: 'Modern e-commerce platform',
    url: 'https://demo-store.neetrino.com',
    status: 'active',
    category: 'E-commerce',
    subcategory: 'Online Store',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    vendor: {
      id: '1',
      name: 'Neetrino',
      website: 'https://neetrino.com',
      logoUrl: 'https://neetrino.com/logo.png',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Portfolio Website',
    description: 'Creative portfolio website',
    url: 'https://demo-portfolio.neetrino.com',
    status: 'active',
    category: 'Portfolio',
    subcategory: 'Creative',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    vendor: {
      id: '2',
      name: 'Neetrino',
      website: 'https://neetrino.com',
      logoUrl: 'https://neetrino.com/logo.png',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// DELETE - удалить демо
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🗑️ Simple API: Начинаем удаление демо с ID:', params.id);
    console.log('🗑️ Simple API: Всего демо в массиве:', demos.length);
    console.log('🗑️ Simple API: ID всех демо:', demos.map(d => d.id));
    
    const index = demos.findIndex(demo => demo.id === params.id);
    console.log('🗑️ Simple API: Найденный индекс:', index);
    
    if (index === -1) {
      console.log('❌ Simple API: Демо не найдено');
      return NextResponse.json(
        { success: false, error: 'Demo not found' },
        { status: 404 }
      );
    }
    
    const deletedDemo = demos[index];
    console.log('🗑️ Simple API: Удаляем демо:', deletedDemo.title);
    
    demos.splice(index, 1);
    console.log('✅ Simple API: Демо удалено. Осталось демо:', demos.length);
    
    return NextResponse.json({
      success: true,
      message: 'Demo deleted successfully',
      remainingCount: demos.length
    });
  } catch (error) {
    console.error('💥 Simple API: Критическая ошибка при удалении:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete demo' },
      { status: 500 }
    );
  }
}
