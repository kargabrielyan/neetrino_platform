import { promises as fs } from 'fs';
import path from 'path';

export interface CsvDemo {
  id: string;
  title: string;
  description: string;
  url: string;
  normalizedUrl: string;
  category: string;
  subcategory?: string;
  imageUrl: string;
  status: string;
  vendorId: string;
  metadata: {
    sku: string;
    regularPrice: number;
    salePrice?: number;
    source: string;
    importedAt: string;
    lastUpdatedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

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
  regularPrice: number;
  salePrice?: number;
  vendor: {
    id: string;
    name: string;
    website: string;
    logoUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

let csvDemos: Demo[] = [];
let isLoaded = false;

// Функция для загрузки CSV данных
async function loadCsvDemos(): Promise<Demo[]> {
  if (isLoaded) {
    return csvDemos;
  }

  try {
    const csvFilePath = path.join(process.cwd(), '..', '..', 'data', 'demos.json');
    const fileContent = await fs.readFile(csvFilePath, 'utf-8');
    const csvData: CsvDemo[] = JSON.parse(fileContent);

    // Преобразуем CSV данные в формат Demo
    csvDemos = csvData.map(csvDemo => ({
      id: csvDemo.id,
      title: csvDemo.title,
      description: csvDemo.description,
      url: csvDemo.url,
      status: csvDemo.status as 'active' | 'draft' | 'deleted',
      category: csvDemo.category,
      subcategory: csvDemo.subcategory || '',
      imageUrl: csvDemo.imageUrl,
      screenshotUrl: csvDemo.imageUrl, // Используем imageUrl как screenshotUrl
      viewCount: Math.floor(Math.random() * 1000), // Генерируем случайное количество просмотров
      isAccessible: true, // Предполагаем, что все демо доступны
      regularPrice: csvDemo.metadata?.regularPrice || 0,
      salePrice: csvDemo.metadata?.salePrice && csvDemo.metadata.salePrice > 0 ? csvDemo.metadata.salePrice : undefined,
      vendor: {
        id: csvDemo.vendorId,
        name: 'CSV Import Vendor',
        website: 'https://neetrino.com',
        logoUrl: 'https://neetrino.com/logo.png',
      },
      createdAt: csvDemo.createdAt,
      updatedAt: csvDemo.updatedAt,
    }));

    isLoaded = true;
    console.log(`📚 Загружено ${csvDemos.length} демо из CSV файла`);
    return csvDemos;
  } catch (error) {
    console.error('Ошибка загрузки CSV демо:', error);
    return [];
  }
}

// Функции для работы с CSV данными
export const csvDemoData = {
  // Получить все демо
  getAll: async (): Promise<Demo[]> => {
    return await loadCsvDemos();
  },
  
  // Получить активные демо
  getActive: async (): Promise<Demo[]> => {
    const demos = await loadCsvDemos();
    return demos.filter(demo => demo.status === 'active' && demo.isAccessible);
  },
  
  // Получить демо по ID
  getById: async (id: string): Promise<Demo | undefined> => {
    const demos = await loadCsvDemos();
    return demos.find(demo => demo.id === id);
  },
  
  // Поиск демо
  search: async (query: string, filters: {
    vendors?: string[];
    categories?: string[];
    subcategories?: string[];
    status?: string;
  } = {}): Promise<Demo[]> => {
    const demos = await loadCsvDemos();
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
  },

  // Получить статистику
  getStats: async () => {
    const demos = await loadCsvDemos();
    const activeDemos = demos.filter(demo => demo.status === 'active' && demo.isAccessible);
    
    return {
      total: demos.length,
      active: activeDemos.length,
      categories: [...new Set(activeDemos.map(demo => demo.category))].length,
      vendors: [...new Set(activeDemos.map(demo => demo.vendor.id))].length,
    };
  }
};
