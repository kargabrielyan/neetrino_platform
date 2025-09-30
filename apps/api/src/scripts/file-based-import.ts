import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

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

interface Demo {
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
  metadata: any;
  createdAt: string;
  updatedAt: string;
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

          const product: CsvProduct = {
            sku: row.sku || '',
            title: row.title.trim(),
            regularPrice: parsePrice(row.regularPrice),
            salePrice: row.salePrice ? parsePrice(row.salePrice) : undefined,
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

function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.trim() === '') {
    return 0;
  }
  
  const price = parseFloat(priceStr.replace(/[^\d.,]/g, '').replace(',', '.'));
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

async function loadExistingDemos(): Promise<Demo[]> {
  const demosFilePath = path.join(__dirname, '..', '..', '..', '..', 'data', 'demos.json');
  
  if (!fs.existsSync(demosFilePath)) {
    return [];
  }

  try {
    const data = fs.readFileSync(demosFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Ошибка при загрузке существующих демо:', error);
    return [];
  }
}

async function saveDemos(demos: Demo[]): Promise<void> {
  const dataDir = path.join(__dirname, '..', '..', '..', '..', 'data');
  const demosFilePath = path.join(dataDir, 'demos.json');

  // Создаем директорию если не существует
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(demosFilePath, JSON.stringify(demos, null, 2));
  console.log(`💾 Сохранено ${demos.length} демо в файл: ${demosFilePath}`);
}

async function importCsvFile() {
  console.log('🚀 Начинаем импорт CSV файла (файловая система)...');
  
  try {
    // Путь к CSV файлу
    const csvFilePath = path.join(process.cwd(), '..', '..', 'Товары-Export-2025-September-29-1558.csv');
    
    // Проверяем существование файла
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV файл не найден: ${csvFilePath}`);
    }

    console.log('📁 Найден CSV файл:', csvFilePath);
    
    // ID вендора для CSV импорта
    const vendorId = 'csv-import-vendor';
    
    // Парсим CSV файл
    const csvProducts = await parseCsvFile(csvFilePath);
    console.log(`📊 Распарсено ${csvProducts.length} товаров из CSV файла`);

    // Загружаем существующие демо
    const existingDemos = await loadExistingDemos();
    console.log(`📚 Загружено ${existingDemos.length} существующих демо`);

    let newProducts = 0;
    let updatedProducts = 0;
    let skippedProducts = 0;
    let errors = 0;

    // Обрабатываем каждый товар
    for (const csvProduct of csvProducts) {
      try {
        // Пропускаем товары без URL
        if (!csvProduct.demoUrl) {
          skippedProducts++;
          continue;
        }

        const normalizedUrl = normalizeUrl(csvProduct.demoUrl);
        
        // Ищем существующий демо
        const existingDemo = existingDemos.find(demo => 
          demo.normalizedUrl === normalizedUrl || demo.url === csvProduct.demoUrl
        );

        if (existingDemo) {
          // Обновляем существующий демо
          existingDemo.title = csvProduct.title;
          existingDemo.description = csvProduct.description || existingDemo.description;
          existingDemo.category = csvProduct.category;
          existingDemo.subcategory = csvProduct.subcategory;
          existingDemo.imageUrl = csvProduct.imageUrl || existingDemo.imageUrl;
          existingDemo.metadata = {
            ...existingDemo.metadata,
            sku: csvProduct.sku,
            regularPrice: csvProduct.regularPrice,
            salePrice: csvProduct.salePrice,
            lastUpdatedAt: new Date().toISOString()
          };
          existingDemo.updatedAt = new Date().toISOString();
          updatedProducts++;
          console.log(`✅ Обновлен демо: ${csvProduct.title}`);
        } else {
          // Создаем новый демо
          const newDemo: Demo = {
            id: generateId(),
            title: csvProduct.title,
            description: csvProduct.description || '',
            url: csvProduct.demoUrl,
            normalizedUrl: normalizedUrl,
            category: csvProduct.category,
            subcategory: csvProduct.subcategory,
            imageUrl: csvProduct.imageUrl,
            status: 'active',
            vendorId: vendorId,
            metadata: {
              sku: csvProduct.sku,
              regularPrice: csvProduct.regularPrice,
              salePrice: csvProduct.salePrice,
              source: 'csv_import',
              importedAt: new Date().toISOString()
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          existingDemos.push(newDemo);
          newProducts++;
          console.log(`➕ Создан новый демо: ${csvProduct.title}`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Ошибка при обработке товара "${csvProduct.title}": ${error.message}`);
      }
    }

    // Сохраняем обновленные демо
    await saveDemos(existingDemos);

    console.log('🎉 Импорт завершен!');
    console.log('📊 Результаты импорта:', {
      totalProcessed: csvProducts.length,
      newProducts,
      updatedProducts,
      skippedProducts,
      errors,
      totalDemos: existingDemos.length
    });

    return {
      totalProcessed: csvProducts.length,
      newProducts,
      updatedProducts,
      skippedProducts,
      errors,
      totalDemos: existingDemos.length
    };
  } catch (error) {
    console.error('❌ Ошибка при импорте CSV:', error);
    throw error;
  }
}

// Запускаем скрипт если он вызван напрямую
if (require.main === module) {
  importCsvFile()
    .then((result) => {
      console.log('🎉 Импорт завершен успешно!');
      console.log('📈 Итоговая статистика:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Ошибка импорта:', error);
      process.exit(1);
    });
}

export { importCsvFile };
