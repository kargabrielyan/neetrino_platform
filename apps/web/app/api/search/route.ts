import { NextRequest, NextResponse } from 'next/server';
import { demoData } from '../../../lib/demo-data';
import { csvDemoData } from '../../../lib/csv-demo-loader';

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

    // Используем CSV данные для поиска
    const filteredDemos = await csvDemoData.search(q, {
      vendors: vendors.length > 0 ? vendors : undefined,
      categories: categories.length > 0 ? categories : undefined,
      subcategories: subcategories.length > 0 ? subcategories : undefined,
    });

    // Фильтрация по цене - показываем только товары с ценами при сортировке по цене
    let demosToSort = filteredDemos;
    if (sortBy === 'price_asc' || sortBy === 'price_desc') {
      demosToSort = filteredDemos.filter(demo => demo.regularPrice > 0);
    }

    // Сортировка
    demosToSort.sort((a, b) => {
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
        case 'price_asc':
          // Сортировка по цене от низкой к высокой (ASC)
          comparison = (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice);
          return comparison; // Не применяем sortOrder для price_asc
        case 'price_desc':
          // Сортировка по цене от высокой к низкой (DESC)
          comparison = (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice);
          return comparison; // Не применяем sortOrder для price_desc
        case 'relevance':
        default:
          // Для релевантности используем viewCount как основной критерий
          comparison = a.viewCount - b.viewCount;
          break;
      }
      return sortOrder === 'ASC' ? comparison : -comparison;
    });

    // Пагинация
    const total = demosToSort.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedDemos = demosToSort.slice(offset, offset + limit);

    // Получаем уникальные фильтры из CSV данных
    const activeDemos = await csvDemoData.getActive();
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
