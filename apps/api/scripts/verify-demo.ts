import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const sku = process.argv[2] || 'xg46lpn75';
  
  console.log('🔍 Проверка товара по SKU:', sku);
  
  const demo = await prisma.demo.findFirst({
    where: { sku: sku },
    include: { vendor: true }
  });
  
  if (demo) {
    console.log('✅ Товар найден:');
    console.log('   id:', demo.id);
    console.log('   sku:', demo.sku);
    console.log('   title:', demo.title);
    console.log('   vendor:', demo.vendor.name);
  } else {
    console.log('❌ Товар не найден');
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);















