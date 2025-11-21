require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const total = await prisma.demo.count();
    const active = await prisma.demo.count({ where: { status: 'active' } });
    const accessible = await prisma.demo.count({ where: { status: 'active', isAccessible: true } });
    
    console.log('📊 Товары в базе данных:');
    console.log(`   Всего: ${total}`);
    console.log(`   Активных: ${active}`);
    console.log(`   Активных и доступных: ${accessible}`);
    
    const sample = await prisma.demo.findMany({
      where: { status: 'active', isAccessible: true },
      take: 3,
      include: { vendor: true }
    });
    
    console.log('\n📦 Примеры товаров:');
    sample.forEach((d, i) => {
      console.log(`   ${i + 1}. ${d.title.substring(0, 50)}... (${d.vendor.name})`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();

