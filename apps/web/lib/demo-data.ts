// Общий модуль для управления демо-данными
export interface Demo {
  id: string;
  title: string;
  description: string;
  url: string;
  status: 'active' | 'draft' | 'deleted';
  category: string;
  subcategory: string;
  imageUrl: string;
  screenshotUrl: string;
  viewCount: number;
  isAccessible: boolean;
  vendor: {
    id: string;
    name: string;
    website: string;
    logoUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Общие тестовые данные
let demos: Demo[] = [
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

// Функции для работы с данными
export const demoData = {
  // Получить все демо
  getAll: (): Demo[] => demos,
  
  // Получить активные демо
  getActive: (): Demo[] => demos.filter(demo => demo.status === 'active' && demo.isAccessible),
  
  // Получить демо по ID
  getById: (id: string): Demo | undefined => demos.find(demo => demo.id === id),
  
  // Создать новое демо
  create: (demoData: Partial<Demo>): Demo => {
    const newDemo: Demo = {
      id: (demos.length + 1).toString(),
      title: demoData.title || 'New Demo',
      description: demoData.description || '',
      url: demoData.url || '',
      status: demoData.status || 'draft',
      category: demoData.category || 'Other',
      subcategory: demoData.subcategory || '',
      imageUrl: demoData.imageUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
      screenshotUrl: demoData.screenshotUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      viewCount: 0,
      isAccessible: true,
      vendor: {
        id: '1',
        name: demoData.vendor?.name || 'Neetrino',
        website: demoData.vendor?.website || 'https://neetrino.com',
        logoUrl: demoData.vendor?.logoUrl || 'https://neetrino.com/logo.png',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    demos.push(newDemo);
    return newDemo;
  },
  
  // Обновить демо
  update: (id: string, updates: Partial<Demo>): Demo | null => {
    const index = demos.findIndex(demo => demo.id === id);
    if (index === -1) return null;
    
    demos[index] = {
      ...demos[index],
      ...updates,
      id, // Сохраняем оригинальный ID
      updatedAt: new Date().toISOString(),
    };
    
    return demos[index];
  },
  
  // Удалить демо
  delete: (id: string): boolean => {
    console.log('🗑️ demo-data: Ищем демо для удаления с ID:', id);
    console.log('🗑️ demo-data: Всего демо в массиве:', demos.length);
    console.log('🗑️ demo-data: ID всех демо:', demos.map(d => d.id));
    
    const index = demos.findIndex(demo => demo.id === id);
    console.log('🗑️ demo-data: Найденный индекс:', index);
    
    if (index === -1) {
      console.log('❌ demo-data: Демо не найдено');
      return false;
    }
    
    const deletedDemo = demos[index];
    console.log('🗑️ demo-data: Удаляем демо:', deletedDemo.title);
    
    demos.splice(index, 1);
    console.log('✅ demo-data: Демо удалено. Осталось демо:', demos.length);
    
    return true;
  },
  
  // Поиск демо
  search: (query: string, filters: {
    vendors?: string[];
    categories?: string[];
    subcategories?: string[];
    status?: string;
  } = {}): Demo[] => {
    let results = demos.filter(demo => demo.status === 'active' && demo.isAccessible);
    
    // Поиск по тексту
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(demo =>
        demo.title.toLowerCase().includes(searchTerm) ||
        demo.description.toLowerCase().includes(searchTerm) ||
        demo.vendor.name.toLowerCase().includes(searchTerm) ||
        demo.category.toLowerCase().includes(searchTerm) ||
        demo.subcategory.toLowerCase().includes(searchTerm)
      );
    }
    
    // Фильтрация
    if (filters.vendors && filters.vendors.length > 0) {
      results = results.filter(demo => filters.vendors!.includes(demo.vendor.id));
    }
    
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(demo => filters.categories!.includes(demo.category));
    }
    
    if (filters.subcategories && filters.subcategories.length > 0) {
      results = results.filter(demo => filters.subcategories!.includes(demo.subcategory));
    }
    
    if (filters.status) {
      results = results.filter(demo => demo.status === filters.status);
    }
    
    return results;
  }
};
