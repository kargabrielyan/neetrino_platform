import { NextRequest, NextResponse } from 'next/server';
import { demoData } from '../../../lib/demo-data';

// GET - поиск демо с фильтрацией
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const vendors = searchParams.getAll('vendors');
    const categories = searchParams.getAll('categories');
    const subcategories = searchParams.getAll('subcategories');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Используем общий модуль для поиска
    const filteredDemos = demoData.search(q, {
      vendors: vendors.length > 0 ? vendors : undefined,
      categories: categories.length > 0 ? categories : undefined,
      subcategories: subcategories.length > 0 ? subcategories : undefined,
    });

    // Сортировка
    filteredDemos.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'viewCount':
          comparison = a.viewCount - b.viewCount;
          break;
        case 'relevance':
        default:
          // Для релевантности используем viewCount как основной критерий
          comparison = a.viewCount - b.viewCount;
          break;
      }
      return sortOrder === 'ASC' ? comparison : -comparison;
    });

    // Пагинация
    const total = filteredDemos.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedDemos = filteredDemos.slice(offset, offset + limit);

    // Получаем уникальные фильтры
    const activeDemos = demoData.getActive();
    const uniqueVendors = [...new Set(activeDemos.map(d => d.vendor.id))]
      .map(id => {
        const vendor = activeDemos.find(d => d.vendor.id === id)?.vendor;
        return {
          id: vendor?.id || id,
          name: vendor?.name || 'Unknown',
          count: activeDemos.filter(d => d.vendor.id === id).length
        };
      });

    const uniqueCategories = [...new Set(activeDemos.map(d => d.category))]
      .map(category => ({
        name: category,
        count: activeDemos.filter(d => d.category === category).length
      }));

    const uniqueSubcategories = [...new Set(activeDemos.map(d => d.subcategory))]
      .map(subcategory => ({
        name: subcategory,
        count: activeDemos.filter(d => d.subcategory === subcategory).length
      }));

    return NextResponse.json({
      success: true,
      data: paginatedDemos,
      total,
      page,
      limit,
      totalPages,
      query: q,
      suggestions: [], // Можно добавить логику для предложений
      filters: {
        vendors: uniqueVendors,
        categories: uniqueCategories,
        subcategories: uniqueSubcategories
      }
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search demos' },
      { status: 500 }
    );
  }
}
