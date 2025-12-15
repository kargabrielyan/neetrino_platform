/**
 * Диагностический скрипт для проверки наличия товара по SKU в БД
 * 
 * Использование:
 *   npx ts-node scripts/check-demo-by-sku.ts xg46lpn75
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const sku = process.argv[2] || 'xg46lpn75';
  
  console.log('🔍 Диагностика поиска товара по SKU\n');
  console.log('SKU для поиска:', sku);
  console.log('─'.repeat(50));

  try {
    // 1. Проверяем прямое совпадение по sku
    console.log('\n1️⃣ Поиск по полю sku:');
    const bySku = await prisma.demo.findFirst({
      where: { sku: sku },
      select: {
        id: true,
        sku: true,
        title: true,
        url: true,
        status: true,
      },
    });

    if (bySku) {
      console.log('   ✅ НАЙДЕНО по sku:');
      console.log('      id:', bySku.id);
      console.log('      sku:', bySku.sku);
      console.log('      title:', bySku.title);
    } else {
      console.log('   ❌ НЕ НАЙДЕНО по sku');
    }

    // 2. Проверяем поиск по metadata.sku
    console.log('\n2️⃣ Поиск по metadata.sku:');
    const byMetaSku = await prisma.demo.findFirst({
      where: {
        metadata: {
          path: ['sku'],
          equals: sku,
        } as any,
      },
      select: {
        id: true,
        sku: true,
        title: true,
        metadata: true,
      },
    });

    if (byMetaSku) {
      console.log('   ✅ НАЙДЕНО по metadata.sku:');
      console.log('      id:', byMetaSku.id);
      console.log('      sku:', byMetaSku.sku);
      console.log('      title:', byMetaSku.title);
      console.log('      metadata.sku:', (byMetaSku.metadata as any)?.sku);
    } else {
      console.log('   ❌ НЕ НАЙДЕНО по metadata.sku');
    }

    // 3. Проверяем поиск по metadata.id
    console.log('\n3️⃣ Поиск по metadata.id:');
    const byMetaId = await prisma.demo.findFirst({
      where: {
        metadata: {
          path: ['id'],
          equals: sku,
        } as any,
      },
      select: {
        id: true,
        sku: true,
        title: true,
        metadata: true,
      },
    });

    if (byMetaId) {
      console.log('   ✅ НАЙДЕНО по metadata.id:');
      console.log('      id:', byMetaId.id);
      console.log('      sku:', byMetaId.sku);
      console.log('      title:', byMetaId.title);
      console.log('      metadata.id:', (byMetaId.metadata as any)?.id);
    } else {
      console.log('   ❌ НЕ НАЙДЕНО по metadata.id');
    }

    // 4. Показываем примеры записей с похожим sku
    console.log('\n4️⃣ Примеры записей (первые 5):');
    const examples = await prisma.demo.findMany({
      take: 5,
      select: {
        id: true,
        sku: true,
        title: true,
        metadata: true,
      },
    });

    examples.forEach((demo, idx) => {
      console.log(`   ${idx + 1}. id: ${demo.id}`);
      console.log(`      sku: ${demo.sku || '(null)'}`);
      console.log(`      title: ${demo.title?.substring(0, 30) || '(null)'}`);
      console.log(`      metadata.sku: ${(demo.metadata as any)?.sku || '(null)'}`);
      console.log(`      metadata.id: ${(demo.metadata as any)?.id || '(null)'}`);
    });

    // 5. Статистика
    console.log('\n5️⃣ Статистика:');
    const total = await prisma.demo.count();
    const withSku = await prisma.demo.count({
      where: { sku: { not: null } },
    });
    const withoutSku = await prisma.demo.count({
      where: { 
        OR: [
          { sku: null },
          { sku: '' }
        ]
      },
    });

    console.log(`   Всего записей: ${total}`);
    console.log(`   С заполненным sku: ${withSku}`);
    console.log(`   Без sku: ${withoutSku}`);

    // 6. Итоговый вывод
    console.log('\n' + '─'.repeat(50));
    if (bySku) {
      console.log('✅ ТОВАР НАЙДЕН в БД по полю sku');
      console.log('   Проблема НЕ в БД, проверяйте NestJS API');
    } else if (byMetaSku || byMetaId) {
      console.log('⚠️  ТОВАР НАЙДЕН в metadata, но НЕ в поле sku');
      console.log('   Нужно запустить: npm run fill-sku');
    } else {
      console.log('❌ ТОВАР НЕ НАЙДЕН в БД');
      console.log('   Нужно импортировать данные: npm run import-json');
    }

  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
    console.error(error.stack);
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















