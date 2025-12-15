/**
 * Тестовый скрипт для проверки цепочки: БД → NestJS → Next.js
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();
const SKU = 'xg46lpn75';
const NESTJS_URL = 'http://localhost:3001';
const NEXTJS_URL = 'http://localhost:3000';

async function main() {
  console.log('🔍 Тестирование цепочки поиска товара\n');
  console.log('─'.repeat(50));

  // 1. Проверка БД
  console.log('\n1️⃣ Проверка БД:');
  const demo = await prisma.demo.findFirst({
    where: { sku: SKU },
    select: { id: true, sku: true, title: true }
  });

  if (demo) {
    console.log('   ✅ Товар найден в БД:');
    console.log('      id:', demo.id);
    console.log('      sku:', demo.sku);
    console.log('      title:', demo.title);
  } else {
    console.log('   ❌ Товар НЕ найден в БД');
    console.log('   💡 Запустите: npm run import-single xg46lpn75');
    await prisma.$disconnect();
    return;
  }

  // 2. Проверка NestJS API
  console.log('\n2️⃣ Проверка NestJS API:');
  try {
    const nestResponse = await fetch(`${NESTJS_URL}/demos/${SKU}`);
    console.log('   URL:', `${NESTJS_URL}/demos/${SKU}`);
    console.log('   Status:', nestResponse.status);

    if (nestResponse.ok) {
      const data = await nestResponse.json();
      console.log('   ✅ NestJS вернул товар:');
      console.log('      id:', data.id);
      console.log('      sku:', data.sku);
      console.log('      title:', data.title);
    } else {
      const errorText = await nestResponse.text();
      console.log('   ❌ NestJS вернул ошибку:');
      console.log('      Status:', nestResponse.status);
      console.log('      Response:', errorText.substring(0, 200));
      console.log('   💡 Проверьте:');
      console.log('      - Запущен ли NestJS: npm run dev (в apps/api)');
      console.log('      - Логи NestJS в консоли');
    }
  } catch (error: any) {
    console.log('   ❌ Ошибка подключения к NestJS:');
    console.log('      Error:', error.message);
    console.log('   💡 Убедитесь, что NestJS запущен на порту 3001');
  }

  // 3. Проверка Next.js API
  console.log('\n3️⃣ Проверка Next.js API:');
  try {
    const nextResponse = await fetch(`${NEXTJS_URL}/api/demos/${SKU}`);
    console.log('   URL:', `${NEXTJS_URL}/api/demos/${SKU}`);
    console.log('   Status:', nextResponse.status);

    if (nextResponse.ok) {
      const data = await nextResponse.json();
      console.log('   ✅ Next.js API вернул товар:');
      console.log('      id:', data.id);
      console.log('      sku:', data.sku);
      console.log('      title:', data.title);
    } else {
      const errorText = await nextResponse.text();
      console.log('   ❌ Next.js API вернул ошибку:');
      console.log('      Status:', nextResponse.status);
      console.log('      Response:', errorText.substring(0, 200));
      console.log('   💡 Проверьте:');
      console.log('      - Запущен ли Next.js: npm run dev (в apps/web)');
      console.log('      - Логи Next.js в консоли');
    }
  } catch (error: any) {
    console.log('   ❌ Ошибка подключения к Next.js:');
    console.log('      Error:', error.message);
    console.log('   💡 Убедитесь, что Next.js запущен на порту 3000');
  }

  console.log('\n' + '─'.repeat(50));
  console.log('✅ Тестирование завершено');

  await prisma.$disconnect();
}

main().catch(console.error);















