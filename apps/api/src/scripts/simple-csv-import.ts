import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { VendorsService } from '../modules/vendors/vendors.service';
import { DemosService } from '../modules/demos/demos.service';
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

async function importCsvFile() {
  console.log('🚀 Начинаем импорт CSV файла...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const demosService = app.get(DemosService);
  const vendorsService = app.get(VendorsService);

  try {
    // Путь к CSV файлу
    const csvFilePath = path.join(process.cwd(), '..', '..', 'Товары-Export-2025-September-29-1558.csv');
    
    // Проверяем существование файла
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV файл не найден: ${csvFilePath}`);
    }

    console.log('📁 Найден CSV файл:', csvFilePath);
    
    // Получаем или создаем вендора для CSV импорта
    let vendor = await vendorsService.findByName('CSV Import Vendor');
    
    if (!vendor) {
      console.log('🔧 Создаем вендора для CSV импорта...');
      vendor = await vendorsService.create({
        name: 'CSV Import Vendor',
        website: 'https://neetrino.com',
        logoUrl: 'https://neetrino.com/logo.png',
        description: 'Вендор для товаров, импортированных из CSV файлов',
        status: 'active',
        metadata: {
          source: 'csv_import',
          createdBy: 'import_script',
          createdAt: new Date().toISOString()
        }
      });
      console.log('✅ Вендор создан:', vendor.id);
    } else {
      console.log('✅ Используем существующего вендора:', vendor.id);
    }

    // Парсим CSV файл
    const csvProducts = await parseCsvFile(csvFilePath);
    console.log(`📊 Распарсено ${csvProducts.length} товаров из CSV файла`);

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
        const existingDemos = await demosService.findAll(1, 1000, 'active', csvProduct.category, vendor.id);
        const existingDemo = existingDemos.data.find(demo => 
          demo.normalizedUrl === normalizedUrl || demo.url === csvProduct.demoUrl
        );

        if (existingDemo) {
          // Обновляем существующий демо
          await demosService.update(existingDemo.id, {
            title: csvProduct.title,
            description: csvProduct.description || existingDemo.description,
            category: csvProduct.category,
            subcategory: csvProduct.subcategory,
            imageUrl: csvProduct.imageUrl || existingDemo.imageUrl,
            metadata: {
              ...existingDemo.metadata,
              sku: csvProduct.sku,
              regularPrice: csvProduct.regularPrice,
              salePrice: csvProduct.salePrice,
              lastUpdatedAt: new Date().toISOString()
            }
          });
          updatedProducts++;
          console.log(`✅ Обновлен демо: ${csvProduct.title}`);
        } else {
          // Создаем новый демо
          await demosService.create({
            title: csvProduct.title,
            description: csvProduct.description || '',
            url: csvProduct.demoUrl,
            category: csvProduct.category,
            subcategory: csvProduct.subcategory,
            imageUrl: csvProduct.imageUrl,
            vendorId: vendor.id,
            metadata: {
              sku: csvProduct.sku,
              regularPrice: csvProduct.regularPrice,
              salePrice: csvProduct.salePrice,
              source: 'csv_import',
              importedAt: new Date().toISOString()
            }
          });
          newProducts++;
          console.log(`➕ Создан новый демо: ${csvProduct.title}`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Ошибка при обработке товара "${csvProduct.title}": ${error.message}`);
      }
    }

    console.log('🎉 Импорт завершен!');
    console.log('📊 Результаты импорта:', {
      totalProcessed: csvProducts.length,
      newProducts,
      updatedProducts,
      skippedProducts,
      errors
    });

    return {
      totalProcessed: csvProducts.length,
      newProducts,
      updatedProducts,
      skippedProducts,
      errors
    };
  } catch (error) {
    console.error('❌ Ошибка при импорте CSV:', error);
    throw error;
  } finally {
    await app.close();
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
