import { NextRequest, NextResponse } from 'next/server';

// Используем API из apps/api вместо прямого подключения к базе
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// GET - поиск демо с фильтрацией из базы данных
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Search API called');
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const vendors = searchParams.getAll('vendors');
    const categories = searchParams.getAll('categories');
    const subcategories = searchParams.getAll('subcategories');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('📋 Search params:', { q, vendors, categories, subcategories, sortBy, page, limit });

    // Проксируем запрос к NestJS API
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    vendors.forEach(v => params.append('vendors', v));
    categories.forEach(c => params.append('categories', c));
    subcategories.forEach(s => params.append('subcategories', s));
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    console.log(`🔄 Fetching from API: ${API_URL}/search?${params.toString()}`);
    
    try {
      const apiResponse = await fetch(`${API_URL}/search?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
      }

      const apiData = await apiResponse.json();
      console.log(`✅ API returned ${apiData.data?.length || 0} demos`);
      
      // Логируем первый товар для отладки цен
      if (apiData.data && apiData.data.length > 0) {
        const firstDemo = apiData.data[0];
        console.log('💰 [Search API] Первый товар:', {
          id: firstDemo.id,
          title: firstDemo.title,
          regularPrice: firstDemo.regularPrice,
          salePrice: firstDemo.salePrice,
          regularPriceType: typeof firstDemo.regularPrice,
          salePriceType: typeof firstDemo.salePrice
        });
      }

      return NextResponse.json(apiData);
    } catch (apiError: any) {
      console.warn('⚠️ API request failed, using fallback:', apiError.message);
      // Fallback к CSV данным если API недоступен
      const { csvDemoData } = await import('../../../lib/csv-demo-loader');
      const filteredDemos = await csvDemoData.search(q, {
        vendors: vendors.length > 0 ? vendors : undefined,
        categories: categories.length > 0 ? categories : undefined,
        subcategories: subcategories.length > 0 ? subcategories : undefined,
      });

      // Сортировка
      let demosToSort = filteredDemos;
      if (sortBy === 'price_asc' || sortBy === 'price_desc') {
        demosToSort = filteredDemos.filter(demo => demo.regularPrice > 0);
        demosToSort.sort((a, b) => {
          const priceA = a.salePrice || a.regularPrice;
          const priceB = b.salePrice || b.regularPrice;
          return sortBy === 'price_asc' ? priceA - priceB : priceB - priceA;
        });
      } else {
        demosToSort.sort((a, b) => {
          if (sortBy === 'title') return a.title.localeCompare(b.title);
          if (sortBy === 'createdAt') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          if (sortBy === 'viewCount') return a.viewCount - b.viewCount;
          return 0;
        });
        if (sortOrder === 'DESC') demosToSort.reverse();
      }

      // Пагинация
      const total = demosToSort.length;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      const paginatedDemos = demosToSort.slice(offset, offset + limit);

      // Фильтры
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
        suggestions: [],
        filters: {
          vendors: uniqueVendors,
          categories: uniqueCategories,
          subcategories: uniqueSubcategories
        }
      });
    }
  } catch (error: any) {
    console.error('❌ Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search demos',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
