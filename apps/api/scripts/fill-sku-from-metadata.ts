/**
 * Скрипт для заполнения поля sku из metadata для всех существующих записей
 * 
 * Использование:
 *   npx ts-node scripts/fill-sku-from-metadata.ts
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Начинаем заполнение поля sku из metadata...\n');

  try {
    // Находим все записи без sku
    const demosWithoutSku = await prisma.demo.findMany({
      where: { 
        OR: [
          { sku: null },
          { sku: '' }
        ]
      },
      select: { 
        id: true, 
        metadata: true,
        title: true
      },
    });

    console.log(`📊 Найдено записей без sku: ${demosWithoutSku.length}\n`);

    if (demosWithoutSku.length === 0) {
      console.log('✅ Все записи уже имеют sku. Ничего делать не нужно.');
      return;
    }

    let updated = 0;
    let skipped = 0;

    for (const demo of demosWithoutSku) {
      const meta: any = demo.metadata || {};
      
      // Пробуем найти sku в разных местах
      const sku =
        meta?.sku ||
        meta?.id ||
        meta?.originalId ||
        null;

      if (!sku || typeof sku !== 'string') {
        console.log(`⚠️  Не удалось найти sku для demo.id=${demo.id}, title="${demo.title?.substring(0, 30)}"`);
        skipped++;
        continue;
      }

      // Проверяем, нет ли уже записи с таким sku
      const existing = await prisma.demo.findFirst({
        where: { 
          sku: sku,
          NOT: { id: demo.id }
        }
      });

      if (existing) {
        console.log(`⚠️  SKU "${sku}" уже используется другим товаром (id=${existing.id}). Пропускаем demo.id=${demo.id}`);
        skipped++;
        continue;
      }

      // Обновляем запись
      await prisma.demo.update({
        where: { id: demo.id },
        data: { sku },
      });

      updated++;
      if (updated % 100 === 0) {
        console.log(`   Прогресс: обновлено ${updated}/${demosWithoutSku.length}...`);
      }
    }

    console.log(`\n✅ Миграция завершена!`);
    console.log(`   Обновлено: ${updated}`);
    console.log(`   Пропущено: ${skipped}`);
    console.log(`   Всего обработано: ${demosWithoutSku.length}`);

  } catch (error: any) {
    console.error('❌ Ошибка при выполнении миграции:', error);
    throw error;
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











