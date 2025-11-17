import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const { name, email } = await request.json();

    // Валидация
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Имя и email обязательны' },
        { status: 400 }
      );
    }

    // Проверяем, не занят ли email другим пользователем
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: session.user.id }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email уже используется другим пользователем' },
        { status: 400 }
      );
    }

    // Обновляем профиль
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Профиль успешно обновлен',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления профиля' },
      { status: 500 }
    );
  }
}

