import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // Убеждаемся, что всегда возвращаем JSON
  
  try {
    console.log('🔵 [REGISTER] Начало регистрации');
    console.log('🔵 [REGISTER] DATABASE_URL:', process.env.DATABASE_URL ? 'установлен' : 'НЕ установлен');
    
    // Используем единый Prisma Client
    const prisma = getPrismaClient();
    
    // Проверка Prisma
    if (!prisma) {
      console.error('❌ [REGISTER] Не удалось получить Prisma клиент');
      console.error('❌ [REGISTER] DATABASE_URL:', process.env.DATABASE_URL || 'не установлен');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database initialization error. Please check connection settings.',
          details: process.env.NODE_ENV === 'development' ? {
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            databaseUrl: process.env.DATABASE_URL ? 'установлен' : 'не установлен'
          } : undefined
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Парсинг body с обработкой ошибок
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('❌ [REGISTER] Ошибка парсинга JSON:', parseError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid data format' 
        },
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    // Валидация данных
    if (!name || !email || !password) {
      console.error('❌ [REGISTER] Отсутствуют обязательные поля:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.error('❌ [REGISTER] Пароль слишком короткий');
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    console.log('🔵 [REGISTER] Проверка существующего пользователя:', email);
    // Проверяем, существует ли пользователь
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError: any) {
      console.error('❌ [REGISTER] Ошибка подключения к БД:', dbError);
      console.error('❌ [REGISTER] Детали ошибки БД:', {
        message: dbError?.message,
        code: dbError?.code,
        meta: dbError?.meta,
        name: dbError?.name
      });
      
      // Не закрываем подключение, так как используем singleton
      // Prisma сам управляет подключением
      
      // Determine error type
      let errorMessage = 'Database connection error.';
      if (dbError?.code === 'P1001' || dbError?.message?.includes('Can\'t reach database server')) {
        errorMessage = 'Database unavailable. Make sure PostgreSQL is running.';
      } else if (dbError?.code === 'P1000') {
        errorMessage = 'Could not connect to database. Please check connection settings.';
      } else if (dbError?.code === 'P1003') {
        errorMessage = 'Database does not exist. Please check database name.';
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? {
            message: dbError?.message,
            code: dbError?.code,
            name: dbError?.name
          } : undefined
        },
        { 
          status: 503,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    if (existingUser) {
      console.error('❌ [REGISTER] Пользователь уже существует:', email);
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    console.log('🔵 [REGISTER] Хеширование пароля');
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('🔵 [REGISTER] Создание пользователя');
    // Создаем пользователя
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'USER',
        },
      });
    } catch (createError: any) {
      console.error('❌ [REGISTER] Ошибка создания пользователя:', createError);
      
      // Обработка специфичных ошибок Prisma
      if (createError?.code === 'P2002') {
        return NextResponse.json(
          { 
            success: false,
            error: 'User with this email already exists' 
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Error creating user',
          details: process.env.NODE_ENV === 'development' ? createError?.message : undefined
        },
        { status: 500 }
      );
    }

    // Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ [REGISTER] Пользователь создан успешно:', user.id);
    console.log('✅ [REGISTER] Email пользователя:', user.email);
    console.log('✅ [REGISTER] Роль пользователя:', user.role);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'User created successfully', 
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ [REGISTER] Критическая ошибка регистрации:', error);
    console.error('❌ [REGISTER] Детали ошибки:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      name: error?.name,
      stack: error?.stack?.substring(0, 500)
    });
    
    // Более детальное сообщение об ошибке
    let errorMessage = 'Внутренняя ошибка сервера';
    let statusCode = 500;
    
    if (error?.code === 'P2002') {
      errorMessage = 'Пользователь с таким email уже существует';
      statusCode = 400;
    } else if (error?.code === 'P1001' || error?.code === 'P1000') {
      errorMessage = 'Не удалось подключиться к базе данных. Убедитесь, что база данных запущена.';
      statusCode = 503;
    } else if (error?.message?.includes('Can\'t reach database server')) {
      errorMessage = 'База данных недоступна. Проверьте настройки подключения.';
      statusCode = 503;
    } else if (error?.message) {
      errorMessage = `Ошибка: ${error.message}`;
    }
    
    // Всегда возвращаем JSON, даже при ошибке
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          message: error?.message,
          code: error?.code,
          name: error?.name
        } : undefined
      },
      { 
        status: statusCode,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
