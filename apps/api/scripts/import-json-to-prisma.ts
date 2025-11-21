/**
 * Скрипт для импорта товаров из data/demos.json в базу данных PostgreSQL через Prisma
 * 
 * Использование:
 *   npm run import-json
 *   или
 *   npx ts-node scripts/import-json-to-prisma.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

interface JsonDemo {
  id: string;
  title: string;
  description?: string;
  url: string;
  normalizedUrl?: string;
  category?: string;
  subcategory?: string;
  imageUrl?: string;
  status?: string;
  vendorId: string;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

async function importDemos() {
  console.log('🚀 Начинаем импорт товаров из JSON в базу данных...\n');

  try {
    // Путь к JSON файлу (в корне проекта)
    const jsonFilePath = path.join(__dirname, '../../../data/demos.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`JSON файл не найден: ${jsonFilePath}`);
    }

    console.log(`📁 Читаем файл: ${jsonFilePath}`);
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const demos: JsonDemo[] = JSON.parse(jsonData);
    
    console.log(`📊 Найдено товаров в JSON: ${demos.length}\n`);

    // Проверяем или создаем вендора
    let vendor = await prisma.vendor.findFirst({
      where: { name: 'CSV Import Vendor' }
    });

    if (!vendor) {
      console.log('🔧 Создаем вендора для импортированных товаров...');
      vendor = await prisma.vendor.create({
        data: {
          name: 'CSV Import Vendor',
          website: 'https://neetrino.com',
          logoUrl: 'https://neetrino.com/logo.png',
          description: 'Вендор для товаров, импортированных из CSV/JSON файлов',
          status: 'active',
          metadata: {
            source: 'json_import',
            createdBy: 'import_script',
            createdAt: new Date().toISOString()
          }
        }
      });
      console.log(`✅ Вендор создан: ${vendor.id}\n`);
    } else {
      console.log(`✅ Используем существующего вендора: ${vendor.id}\n`);
    }

    let newDemos = 0;
    let updatedDemos = 0;
    let skippedDemos = 0;
    let errors = 0;
    const batchSize = 100; // Обрабатываем по 100 товаров за раз

    console.log('📦 Начинаем импорт товаров...\n');

    // Обрабатываем товары батчами
    for (let i = 0; i < demos.length; i += batchSize) {
      const batch = demos.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(demos.length / batchSize);

      console.log(`📦 Обрабатываем батч ${batchNumber}/${totalBatches} (${batch.length} товаров)...`);

      for (const demoData of batch) {
        try {
          // Пропускаем товары без URL или названия
          if (!demoData.url || !demoData.title) {
            skippedDemos++;
            continue;
          }

          const normalizedUrl = demoData.normalizedUrl || demoData.url.toLowerCase().trim();

          // Проверяем, существует ли демо
          const existingDemo = await prisma.demo.findFirst({
            where: { normalizedUrl }
          });

          if (existingDemo) {
            // Обновляем существующий демо
            await prisma.demo.update({
              where: { id: existingDemo.id },
              data: {
                title: demoData.title,
                description: demoData.description || null,
                url: demoData.url,
                normalizedUrl: normalizedUrl,
                category: demoData.category || null,
                subcategory: demoData.subcategory || null,
                imageUrl: demoData.imageUrl || null,
                status: (demoData.status as any) || 'active',
                metadata: demoData.metadata || {},
                updatedAt: new Date()
              }
            });
            updatedDemos++;
          } else {
            // Создаем новый демо
            // Обрезаем длинные поля до максимальной длины
            const maxTitleLength = 255;
            const maxUrlLength = 500;
            const title = demoData.title.length > maxTitleLength 
              ? demoData.title.substring(0, maxTitleLength - 3) + '...' 
              : demoData.title;
            const url = demoData.url.length > maxUrlLength 
              ? demoData.url.substring(0, maxUrlLength - 3) + '...' 
              : demoData.url;
            
            await prisma.demo.create({
              data: {
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
            newDemos++;
          }
        } catch (error: any) {
          errors++;
          console.error(`❌ Ошибка при обработке товара "${demoData.title}": ${error.message}`);
        }
      }

      // Показываем прогресс
      const processed = Math.min(i + batchSize, demos.length);
      const progress = ((processed / demos.length) * 100).toFixed(1);
      console.log(`   Прогресс: ${processed}/${demos.length} (${progress}%)\n`);
    }

    // Обновляем счетчик демо у вендора
    const totalDemos = await prisma.demo.count({
      where: { vendorId: vendor.id }
    });

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { demoCount: totalDemos }
    });

    console.log('🎉 Импорт завершен!\n');
    console.log('📊 Результаты импорта:');
    console.log(`   ✅ Новых товаров: ${newDemos}`);
    console.log(`   🔄 Обновлено товаров: ${updatedDemos}`);
    console.log(`   ⏭️  Пропущено товаров: ${skippedDemos}`);
    console.log(`   ❌ Ошибок: ${errors}`);
    console.log(`   📦 Всего в базе данных: ${totalDemos}\n`);

  } catch (error: any) {
    console.error('❌ Критическая ошибка при импорте:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск
importDemos()
  .then(() => {
    console.log('✅ Скрипт завершен успешно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Ошибка выполнения скрипта:', error);
    process.exit(1);
  });

