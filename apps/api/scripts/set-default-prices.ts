/**
 * Скрипт для установки дефолтных цен для товаров без цен
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setDefaultPrices() {
  console.log('🔄 Обновление цен для товаров без цен...');
  
  // Обновляем товары, у которых нет цены
  const result = await prisma.demo.updateMany({
    where: {
      OR: [
        { regularPrice: null },
        { regularPrice: { equals: 0 } }
      ]
    },
    data: {
      regularPrice: 400000,
      salePrice: 200000
    }
  });
  
  console.log(`✅ Обновлено ${result.count} товаров с дефолтными ценами`);
  
  // Проверяем результат
  const demosWithPrices = await prisma.demo.count({
    where: {
      regularPrice: { not: null, gt: 0 }
    }
  });
  
  const totalDemos = await prisma.demo.count();
  
  console.log(`📊 Всего товаров: ${totalDemos}`);
  console.log(`💰 Товаров с ценами: ${demosWithPrices}`);
}

setDefaultPrices()
  .catch(console.error)
  .finally(() => prisma.$disconnect());







