/**
 * Скрипт для импорта одного товара по SKU
 * 
 * Использование:
 *   npx ts-node scripts/import-single-demo.ts xg46lpn75
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const sku = process.argv[2];
  
  if (!sku) {
    console.error('❌ Укажите SKU товара');
    console.log('Использование: npx ts-node scripts/import-single-demo.ts <SKU>');
    process.exit(1);
  }

  console.log('🔍 Импорт товара по SKU:', sku);
  console.log('─'.repeat(50));

  try {
    // Загружаем JSON файл
    const jsonPath = path.join(__dirname, '../../../data/demos.json');
    console.log('📂 Загрузка JSON файла:', jsonPath);
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ Файл не найден:', jsonPath);
      process.exit(1);
    }

    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const demos: any[] = JSON.parse(jsonContent);
    
    console.log(`📊 Загружено ${demos.length} товаров из JSON`);

    // Ищем товар по SKU
    const demoData = demos.find(d => d.id === sku);
    
    if (!demoData) {
      console.error(`❌ Товар с SKU "${sku}" не найден в JSON файле`);
      process.exit(1);
    }

    console.log('✅ Товар найден в JSON:');
    console.log('   title:', demoData.title);
    console.log('   url:', demoData.url);
    console.log('   category:', demoData.category);

    // Получаем или создаем вендора
    let vendor = await prisma.vendor.findFirst({
      where: { name: 'CSV Vendor' }
    });

    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: {
          name: 'CSV Vendor',
          website: 'https://neetrino.com',
          logoUrl: 'https://neetrino.com/logo.png',
          status: 'active',
        },
      });
      console.log('✅ Создан вендор:', vendor.name);
    }

    // Подготавливаем данные
    const cleanSku = sku.trim();
    const normalizedUrl = (demoData.normalizedUrl || demoData.url || '').toLowerCase().trim();
    
    const maxTitleLength = 255;
    const maxUrlLength = 500;
    const title = (demoData.title || '').length > maxTitleLength 
      ? (demoData.title || '').substring(0, maxTitleLength - 3) + '...' 
      : (demoData.title || 'Untitled');
    const url = (demoData.url || '').length > maxUrlLength 
      ? (demoData.url || '').substring(0, maxUrlLength - 3) + '...' 
      : (demoData.url || '');

    // Проверяем, существует ли уже товар
    const existingDemo = await prisma.demo.findFirst({
      where: { sku: cleanSku }
    });

    if (existingDemo) {
      console.log('🔄 Обновление существующего товара...');
      await prisma.demo.update({
        where: { id: existingDemo.id },
        data: {
          sku: cleanSku,
          title: title,
          description: demoData.description || null,
          url: url,
          normalizedUrl: normalizedUrl.length > maxUrlLength 
            ? normalizedUrl.substring(0, maxUrlLength - 3) + '...' 
            : normalizedUrl,
          category: demoData.category || null,
          subcategory: demoData.subcategory || null,
          imageUrl: demoData.imageUrl || null,
          status: (demoData.status as any) || 'active',
          metadata: demoData.metadata || {},
          updatedAt: new Date()
        }
      });
      console.log('✅ Товар обновлен');
    } else {
      console.log('➕ Создание нового товара...');
      await prisma.demo.create({
        data: {
          sku: cleanSku,
          title: title,
          description: demoData.description || null,
          url: url,
          normalizedUrl: normalizedUrl.length > maxUrlLength 
            ? normalizedUrl.substring(0, maxUrlLength - 3) + '...' 
            : normalizedUrl,
          category: demoData.category || null,
          subcategory: demoData.subcategory || null,
          imageUrl: demoData.imageUrl || null,
          status: (demoData.status as any) || 'active',
          vendorId: vendor.id,
          metadata: demoData.metadata || {},
          createdAt: demoData.createdAt ? new Date(demoData.createdAt) : new Date(),
          updatedAt: demoData.updatedAt ? new Date(demoData.updatedAt) : new Date()
        }
      });
      console.log('✅ Товар создан');
    }

    // Проверяем результат
    const importedDemo = await prisma.demo.findFirst({
      where: { sku: cleanSku },
      include: { vendor: true }
    });

    if (importedDemo) {
      console.log('\n✅ Импорт завершен успешно!');
      console.log('   id:', importedDemo.id);
      console.log('   sku:', importedDemo.sku);
      console.log('   title:', importedDemo.title);
    } else {
      console.error('❌ Товар не найден после импорта');
    }

  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Критическая ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
















