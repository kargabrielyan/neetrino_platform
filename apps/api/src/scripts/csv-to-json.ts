import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

interface CsvProduct {
  sku: string;
  title: string;
  regularPrice: number;
  salePrice?: number;
  demoUrl: string;
  category: string;
  subcategory?: string;
  imageUrl: string;
  description?: string;
}

interface DemoData {
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

function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.trim() === '') {
    return 0;
  }
  
  // Убираем все символы кроме цифр, точек и запятых
  const cleanPrice = priceStr.replace(/[^\d.,]/g, '');
  
  // Заменяем запятую на точку для правильного парсинга
  const normalizedPrice = cleanPrice.replace(',', '.');
  
  const price = parseFloat(normalizedPrice);
  return isNaN(price) ? 0 : price;
}

function parseCategory(categoryStr: string): string {
  if (!categoryStr || categoryStr.trim() === '') {
    return 'Other';
  }

  const parts = categoryStr.split('>');
  return parts[0]?.trim() || 'Other';
}

function parseSubcategory(categoryStr: string): string | undefined {
  if (!categoryStr || categoryStr.trim() === '') {
    return undefined;
  }

  const parts = categoryStr.split('>');
  return parts[1]?.trim() || undefined;
}

function normalizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

async function parseCsvFile(filePath: string): Promise<CsvProduct[]> {
  return new Promise((resolve, reject) => {
    const products: CsvProduct[] = [];
    const stream = fs.createReadStream(filePath);

    stream
      .pipe(csv({
        separator: ';',
        headers: [
          'sku',
          'title', 
          'regularPrice',
          'salePrice',
          'demoUrl',
          'category',
          'imageUrl',
          'description'
        ]
      }))
      .on('data', (row) => {
        try {
          // Пропускаем строки без названия или URL
          if (!row.title || !row.demoUrl) {
            return;
          }

          const regularPrice = parsePrice(row.regularPrice);
          const salePrice = row.salePrice ? parsePrice(row.salePrice) : undefined;

          // Оставляем товары без цены как есть (regularPrice = 0)

          const product: CsvProduct = {
            sku: row.sku || '',
            title: row.title.trim(),
            regularPrice,
            salePrice: salePrice && salePrice > 0 ? salePrice : undefined,
            demoUrl: row.demoUrl.trim(),
            category: parseCategory(row.category),
            subcategory: parseSubcategory(row.category),
            imageUrl: row.imageUrl || '',
            description: row.description || ''
          };

          products.push(product);
        } catch (error) {
          console.warn(`Ошибка при парсинге строки: ${JSON.stringify(row)}`, error);
        }
      })
      .on('end', () => {
        console.log(`Успешно распарсено ${products.length} товаров из CSV файла`);
        resolve(products);
      })
      .on('error', (error) => {
        console.error('Ошибка при парсинге CSV файла:', error);
        reject(error);
      });
  });
}

async function convertCsvToJson() {
  console.log('🚀 Начинаем конвертацию CSV в JSON...');
  
  try {
    // Путь к CSV файлу
    const csvFilePath = path.join(process.cwd(), '..', '..', 'Товары-Export-2025-September-29-1558.csv');
    
    // Проверяем существование файла
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV файл не найден: ${csvFilePath}`);
    }

    console.log('📁 Найден CSV файл:', csvFilePath);
    
    // Парсим CSV файл
    const csvProducts = await parseCsvFile(csvFilePath);
    console.log(`📊 Распарсено ${csvProducts.length} товаров из CSV файла`);

    // Конвертируем в формат Demo
    const demos: DemoData[] = csvProducts.map((product, index) => {
      const now = new Date().toISOString();
      return {
        id: generateId(),
        title: product.title,
        description: product.description || '',
        url: product.demoUrl,
        normalizedUrl: normalizeUrl(product.demoUrl),
        category: product.category,
        subcategory: product.subcategory,
        imageUrl: product.imageUrl,
        status: 'active',
        vendorId: 'csv-vendor-1',
        metadata: {
          sku: product.sku,
          regularPrice: product.regularPrice,
          salePrice: product.salePrice,
          source: 'csv_import',
          importedAt: now
        },
        createdAt: now,
        updatedAt: now
      };
    });

    // Создаем папку data если её нет
    const dataDir = path.join(process.cwd(), '..', '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Сохраняем в JSON файл
    const jsonFilePath = path.join(dataDir, 'demos.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(demos, null, 2));

    console.log('🎉 Конвертация завершена!');
    console.log('📊 Результаты:');
    console.log(`  - Всего товаров: ${csvProducts.length}`);
    console.log(`  - Создано демо: ${demos.length}`);
    console.log(`  - Сохранено в: ${jsonFilePath}`);

    // Статистика по ценам
    const withPrices = demos.filter(d => d.metadata.regularPrice > 0).length;
    const withSalePrices = demos.filter(d => d.metadata.salePrice && d.metadata.salePrice > 0).length;
    console.log(`  - С ценами: ${withPrices}`);
    console.log(`  - Со скидками: ${withSalePrices}`);

    return {
      totalProducts: csvProducts.length,
      totalDemos: demos.length,
      withPrices,
      withSalePrices
    };
  } catch (error) {
    console.error('❌ Ошибка при конвертации CSV:', error);
    throw error;
  }
}

// Запускаем скрипт если он вызван напрямую
if (require.main === module) {
  convertCsvToJson()
    .then((result) => {
      console.log('🎉 Конвертация завершена успешно!');
      console.log('📈 Итоговая статистика:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Ошибка конвертации:', error);
      process.exit(1);
    });
}

export { convertCsvToJson };
