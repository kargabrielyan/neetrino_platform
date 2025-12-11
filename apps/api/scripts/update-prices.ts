/**
 * Скрипт для обновления цен в базе данных из JSON файла
 * Запуск: npx ts-node scripts/update-prices.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface JsonDemo {
  id: string;
  regularPrice?: number;
  salePrice?: number;
  title?: string;
  metadata?: {
    regularPrice?: number;
    salePrice?: number;
    sku?: string;
  };
}

async function updatePrices() {
  console.log('🔄 Загрузка данных из JSON...');
  
  const jsonPath = path.join(__dirname, '../../../data/demos.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Файл demos.json не найден:', jsonPath);
    return;
  }
  
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const jsonDemos: JsonDemo[] = JSON.parse(jsonContent);
  
  console.log(`📊 Загружено ${jsonDemos.length} записей из JSON`);
  
  // Создаем Map для быстрого поиска по SKU
  const priceMap = new Map<string, { regularPrice: number; salePrice: number }>();
  
  for (const demo of jsonDemos) {
    // Цены могут быть на верхнем уровне или внутри metadata
    const regularPrice = demo.regularPrice || demo.metadata?.regularPrice || 0;
    const salePrice = demo.salePrice || demo.metadata?.salePrice || 0;
    
    if (demo.id && (regularPrice > 0 || salePrice > 0)) {
      priceMap.set(demo.id, {
        regularPrice,
        salePrice
      });
    }
  }
  
  console.log(`💰 Найдено ${priceMap.size} записей с ценами`);
  
  // Получаем все демо из базы данных
  const dbDemos = await prisma.demo.findMany({
    select: { id: true, sku: true, title: true, regularPrice: true }
  });
  
  console.log(`📋 В базе данных ${dbDemos.length} демо`);
  
  let updated = 0;
  let skipped = 0;
  let notFound = 0;
  
  for (const dbDemo of dbDemos) {
    const sku = dbDemo.sku;
    
    if (!sku) {
      notFound++;
      continue;
    }
    
    const prices = priceMap.get(sku);
    
    if (!prices) {
      notFound++;
      continue;
    }
    
    // Пропускаем, если цена уже установлена
    if (dbDemo.regularPrice && Number(dbDemo.regularPrice) > 0) {
      skipped++;
      continue;
    }
    
    // Обновляем цены
    if (prices.regularPrice > 0 || prices.salePrice > 0) {
      await prisma.demo.update({
        where: { id: dbDemo.id },
        data: {
          regularPrice: prices.regularPrice > 0 ? prices.regularPrice : null,
          salePrice: prices.salePrice > 0 ? prices.salePrice : null
        }
      });
      updated++;
      
      if (updated % 1000 === 0) {
        console.log(`✅ Обновлено ${updated} записей...`);
      }
    }
  }
  
  console.log('\n📊 Результаты:');
  console.log(`  ✅ Обновлено: ${updated}`);
  console.log(`  ⏭️ Пропущено (уже есть цена): ${skipped}`);
  console.log(`  ❌ Не найдено в JSON: ${notFound}`);
  
  // Проверяем результат
  const demosWithPrices = await prisma.demo.count({
    where: {
      regularPrice: { not: null }
    }
  });
  
  console.log(`\n💰 Всего товаров с ценами в БД: ${demosWithPrices}`);
}

updatePrices()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

