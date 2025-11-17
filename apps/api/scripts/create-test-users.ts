import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('🔐 Создание тестовых пользователей...');

    // Создаем админа
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@neetrino.com' },
      update: {},
      create: {
        email: 'admin@neetrino.com',
        name: 'Администратор',
        password: adminPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Админ создан:', admin.email);

    // Создаем тестового пользователя
    const userPassword = await bcrypt.hash('password123', 12);
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Тестовый пользователь',
        password: userPassword,
        role: 'USER',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Пользователь создан:', user.email);

    // Создаем еще одного пользователя
    const user2Password = await bcrypt.hash('user123', 12);
    const user2 = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Обычный пользователь',
        password: user2Password,
        role: 'USER',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Пользователь 2 создан:', user2.email);

    console.log('\n🎉 Все тестовые пользователи созданы!');
    console.log('\n📋 Данные для входа:');
    console.log('👑 Админ:');
    console.log('   Email: admin@neetrino.com');
    console.log('   Password: admin123');
    console.log('   Role: ADMIN');
    console.log('\n👤 Пользователь 1:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('   Role: USER');
    console.log('\n👤 Пользователь 2:');
    console.log('   Email: user@example.com');
    console.log('   Password: user123');
    console.log('   Role: USER');

  } catch (error) {
    console.error('❌ Ошибка при создании пользователей:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
