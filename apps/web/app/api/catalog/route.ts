import { NextRequest, NextResponse } from 'next/server';

// Общие тестовые данные для каталога и админ-панели
let demos: any[] = [
  {
    id: '1',
    title: 'E-commerce Store',
    description: 'Modern e-commerce platform with advanced features and AI-powered recommendations',
    url: 'https://demo-store.neetrino.com',
    status: 'active',
    category: 'E-commerce',
    subcategory: 'Online Store',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    screenshotUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    viewCount: 150,
    isAccessible: true,
    vendor: {
      id: '1',
      name: 'Neetrino',
      website: 'https://neetrino.com',
      logoUrl: 'https://neetrino.com/logo.png',
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Portfolio Website',
    description: 'Creative portfolio website with modern design and smooth animations',
    url: 'https://demo-portfolio.neetrino.com',
    status: 'active',
    category: 'Portfolio',
    subcategory: 'Creative',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    screenshotUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    viewCount: 89,
    isAccessible: true,
    vendor: {
      id: '2',
      name: 'Neetrino',
      website: 'https://neetrino.com',
      logoUrl: 'https://neetrino.com/logo.png',
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    title: 'Blog Platform',
    description: 'Content management system for bloggers with modern interface',
    url: 'https://demo-blog.neetrino.com',
    status: 'active',
    category: 'Blog',
    subcategory: 'CMS',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    screenshotUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    viewCount: 234,
    isAccessible: true,
    vendor: {
      id: '3',
      name: 'Neetrino',
      website: 'https://neetrino.com',
      logoUrl: 'https://neetrino.com/logo.png',
    },
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    title: 'Corporate Website',
    description: 'Professional corporate website with modern design and responsive layout',
    url: 'https://demo-corporate.neetrino.com',
    status: 'active',
    category: 'Corporate',
    subcategory: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    screenshotUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    viewCount: 67,
    isAccessible: true,
    vendor: {
      id: '4',
      name: 'Neetrino',
      website: 'https://neetrino.com',
      logoUrl: 'https://neetrino.com/logo.png',
    },
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '5',
    title: 'SaaS Dashboard',
    description: 'Software as a Service dashboard with analytics and user management',
    url: 'https://demo-saas.neetrino.com',
    status: 'active',
    category: 'SaaS',
    subcategory: 'Dashboard',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    screenshotUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    viewCount: 312,
    isAccessible: true,
    vendor: {
      id: '5',
      name: 'Neetrino',
      website: 'https://neetrino.com',
      logoUrl: 'https://neetrino.com/logo.png',
    },
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

// GET - получить все активные демо для каталога
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Фильтруем только активные демо
    let filteredDemos = demos.filter(demo => demo.status === 'active' && demo.isAccessible);

    // Фильтрация по категории
    if (category) {
      filteredDemos = filteredDemos.filter(demo => 
        demo.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Фильтрация по поиску
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredDemos = filteredDemos.filter(demo =>
        demo.title.toLowerCase().includes(searchTerm) ||
        demo.description.toLowerCase().includes(searchTerm) ||
        demo.vendor.name.toLowerCase().includes(searchTerm)
      );
    }

    // Пагинация
    const total = filteredDemos.length;
    const paginatedDemos = filteredDemos.slice(offset, offset + limit);

    // Получаем уникальные категории
    const categories = [...new Set(demos.filter(d => d.status === 'active').map(d => d.category))];

    return NextResponse.json({
      success: true,
      data: {
        demos: paginatedDemos,
        total,
        categories,
        pagination: {
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
