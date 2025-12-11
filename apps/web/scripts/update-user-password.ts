import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateUserPassword() {
  try {
    const email = 'test@test.test';
    const newPassword = 'pass';

    console.log(`🔐 Обновление пароля для пользователя: ${email}`);

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Пользователь ${email} не найден!`);
      console.log('💡 Создаю нового пользователя...');
      
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const newUser = await prisma.user.create({
        data: {
          email,
          name: 'Test User',
          password: hashedPassword,
          role: 'USER',
          emailVerified: new Date(),
        },
      });
      console.log('✅ Пользователь создан:', newUser.email);
    } else {
      // Хешируем новый пароль
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      // Обновляем пароль
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
        },
      });
      console.log(`✅ Пароль обновлен для пользователя: ${email}`);
    }

    console.log('\n📋 Данные для входа:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);

  } catch (error) {
    console.error('❌ Ошибка при обновлении пароля:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserPassword();

