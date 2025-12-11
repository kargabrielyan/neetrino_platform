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
    // Определяем путь к файлу относительно корня проекта
    // В Next.js API routes process.cwd() указывает на корень проекта Next.js (apps/web)
    const projectRoot = process.cwd();
    console.log('📁 Текущая рабочая директория:', projectRoot);
    
    // Пробуем разные пути к файлу
    const possiblePaths = [
      path.join(projectRoot, '..', '..', 'data', 'demos.json'), // Из apps/web -> корень проекта
      path.resolve(projectRoot, '..', '..', 'data', 'demos.json'), // Абсолютный путь
      path.join(projectRoot, 'data', 'demos.json'), // Из корня Next.js проекта
      path.join(projectRoot, '..', 'data', 'demos.json'), // Альтернативный путь
    ];
    
    console.log('🔍 Проверяем пути:', possiblePaths);
    
    let csvFilePath: string | null = null;
    
    // Пробуем найти файл по одному из путей
    for (const filePath of possiblePaths) {
      try {
        await fs.access(filePath);
        csvFilePath = filePath;
        console.log('✅ Файл найден по пути:', filePath);
        break;
      } catch (accessError: any) {
        console.log('❌ Файл не найден по пути:', filePath, accessError.code);
        // Продолжаем поиск
        continue;
      }
    }
    
    if (!csvFilePath) {
      const errorMsg = `Не удалось найти файл demos.json. Проверенные пути: ${possiblePaths.join(', ')}. CWD: ${projectRoot}`;
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('📂 Загрузка демо из файла:', csvFilePath);
    let fileContent: string;
    try {
      fileContent = await fs.readFile(csvFilePath, 'utf-8');
      console.log('📄 Размер файла:', fileContent.length, 'символов');
    } catch (readError: any) {
      console.error('❌ Ошибка чтения файла:', readError.message);
      throw new Error(`Не удалось прочитать файл: ${readError.message}`);
    }
    
    let csvData: CsvDemo[];
    try {
      csvData = JSON.parse(fileContent);
      console.log('📊 Загружено записей из JSON:', csvData.length);
    } catch (parseError: any) {
      console.error('❌ Ошибка парсинга JSON:', parseError.message);
      throw new Error(`Не удалось распарсить JSON файл: ${parseError.message}`);
    }
    
    if (!Array.isArray(csvData)) {
      throw new Error('JSON файл должен содержать массив данных');
    }

    // Преобразуем CSV данные в формат Demo
    try {
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
    } catch (mapError: any) {
      console.error('❌ Ошибка преобразования данных:', mapError.message);
      throw new Error(`Ошибка при преобразовании данных: ${mapError.message}`);
    }

    isLoaded = true;
    console.log(`📚 Загружено ${csvDemos.length} демо из CSV файла`);
    return csvDemos;
  } catch (error: any) {
    console.error('❌ Ошибка загрузки CSV демо:', error);
    console.error('❌ Стек ошибки:', error.stack);
    // Не возвращаем пустой массив, а пробрасываем ошибку дальше
    throw error;
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
    try {
      if (!id || typeof id !== 'string') {
        console.warn('⚠️ [CSV] Неверный ID:', id);
        return undefined;
      }
      
      const demos = await loadCsvDemos();
      const searchId = String(id).trim();
      console.log('🔍 [CSV] Поиск демо с ID:', searchId, 'в', demos.length, 'записях');
      console.log('🔍 [CSV] Тип ID:', typeof searchId, 'Длина:', searchId.length);
      
      if (!demos || demos.length === 0) {
        console.warn('⚠️ [CSV] Массив демо пуст');
        return undefined;
      }
      
      // Сначала пробуем точное совпадение
      let found = demos.find(demo => {
        if (!demo || !demo.id) return false;
        const demoId = String(demo.id).trim();
        return demoId === searchId;
      });
      
      // Если не нашли, пробуем без учета регистра
      if (!found) {
        console.log('🔍 [CSV] Точное совпадение не найдено, пробуем без учета регистра...');
        found = demos.find(demo => {
          if (!demo || !demo.id) return false;
          const demoId = String(demo.id).trim();
          return demoId.toLowerCase() === searchId.toLowerCase();
        });
      }
      
      // Если все еще не нашли, пробуем частичное совпадение
      if (!found) {
        console.log('🔍 [CSV] Совпадение без учета регистра не найдено, пробуем частичное...');
        found = demos.find(demo => {
          if (!demo || !demo.id) return false;
          const demoId = String(demo.id).trim();
          return demoId.includes(searchId) || searchId.includes(demoId);
        });
      }
      
      if (found) {
        console.log('✅ [CSV] Демо найдено:', found.title, 'ID:', found.id);
      } else {
        console.log('❌ [CSV] Демо не найдено. Искомый ID:', searchId);
        console.log('🔍 [CSV] Первые 10 ID из базы:', demos.slice(0, 10).map(d => ({
          id: d.id,
          type: typeof d.id,
          length: String(d.id).length
        })));
        // Пробуем найти похожие ID
        const similar = demos.filter(d => {
          if (!d || !d.id) return false;
          const demoId = String(d.id).toLowerCase();
          const searchIdLower = searchId.toLowerCase();
          return demoId.includes(searchIdLower.substring(0, Math.min(3, searchIdLower.length))) ||
                 searchIdLower.includes(demoId.substring(0, Math.min(3, demoId.length)));
        }).slice(0, 5);
        if (similar.length > 0) {
          console.log('🔍 [CSV] Похожие ID:', similar.map(d => ({ id: d.id, title: d.title?.substring(0, 30) })));
        }
      }
      return found;
    } catch (error: any) {
      console.error('❌ [CSV] Ошибка в getById:', error.message);
      console.error('❌ [CSV] Тип ошибки:', error?.constructor?.name);
      console.error('❌ [CSV] Стек ошибки:', error.stack);
      // Возвращаем undefined вместо проброса ошибки, чтобы API мог вернуть 404
      return undefined;
    }
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
