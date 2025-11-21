const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDemos() {
  try {
    const total = await prisma.demo.count();
    const active = await prisma.demo.count({ where: { status: 'active' } });
    const accessible = await prisma.demo.count({ where: { status: 'active', isAccessible: true } });
    
    console.log('📊 Статистика товаров:');
    console.log(`   Всего товаров: ${total}`);
    console.log(`   Активных товаров: ${active}`);
    console.log(`   Активных и доступных: ${accessible}`);
    
    const sample = await prisma.demo.findMany({
      where: { status: 'active', isAccessible: true },
      take: 5,
      include: { vendor: true }
    });
    
    console.log('\n📦 Примеры товаров:');
    sample.forEach((demo, i) => {
      console.log(`   ${i + 1}. ${demo.title} (${demo.vendor.name})`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDemos();


