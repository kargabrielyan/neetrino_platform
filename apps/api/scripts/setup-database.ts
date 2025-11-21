/**
 * Скрипт для настройки базы данных PostgreSQL
 * 
 * Этот скрипт:
 * 1. Проверяет подключение к PostgreSQL
 * 2. Создает базу данных neetrino_platform (если не существует)
 * 3. Применяет миграции Prisma
 * 
 * Использование:
 *   npx ts-node scripts/setup-database.ts
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Загружаем переменные окружения
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️  Файл .env не найден, используются переменные окружения системы');
}

const DB_NAME = process.env.DB_DATABASE || 'neetrino_platform';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');
const DB_USER = process.env.DB_USERNAME || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

console.log('🔧 Настройка базы данных PostgreSQL...\n');
console.log(`📋 Параметры подключения:`);
console.log(`   Host: ${DB_HOST}`);
console.log(`   Port: ${DB_PORT}`);
console.log(`   User: ${DB_USER}`);
console.log(`   Database: ${DB_NAME}\n`);

// Функция для создания базы данных
async function createDatabase() {
  // Подключаемся к базе данных postgres (по умолчанию)
  const adminClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres', // Подключаемся к стандартной БД для создания новой
  });

  try {
    console.log('🔌 Подключение к PostgreSQL...');
    await adminClient.connect();
    console.log('✅ Подключение успешно!\n');

    // Проверяем, существует ли база данных
    console.log(`🔍 Проверка существования базы данных "${DB_NAME}"...`);
    const result = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (result.rows.length > 0) {
      console.log(`⚠️  База данных "${DB_NAME}" уже существует.\n`);
    } else {
      console.log(`📦 Создание базы данных "${DB_NAME}"...`);
      await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`✅ База данных "${DB_NAME}" успешно создана!\n`);
    }

    await adminClient.end();
    return true;
  } catch (error: any) {
    console.error('❌ Ошибка при работе с базой данных:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === '28P01') {
      console.error('💡 Проблема: Неверные учетные данные (пароль или пользователь)');
      console.error('   Решение: Проверьте DB_USERNAME и DB_PASSWORD в файле .env\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Проблема: PostgreSQL не запущен или недоступен');
      console.error('   Решение: Убедитесь, что PostgreSQL запущен на порту 5432\n');
    } else if (error.code === '3D000') {
      console.error('💡 Проблема: База данных postgres не существует');
      console.error('   Решение: Проверьте установку PostgreSQL\n');
    }
    
    await adminClient.end().catch(() => {});
    return false;
  }
}

// Функция для применения миграций Prisma
async function applyMigrations() {
  try {
    console.log('🔄 Применение миграций Prisma...');
    
    // Переходим в директорию с Prisma схемой
    const prismaDir = path.join(__dirname, '../prisma');
    
    // Используем db push для создания схемы (если нет миграций)
    // Или migrate deploy для применения существующих миграций
    try {
      execSync('npx prisma db push --skip-generate', {
        cwd: prismaDir,
        stdio: 'inherit',
        env: { ...process.env },
      });
      console.log('✅ Схема базы данных успешно применена!\n');
    } catch (pushError) {
      console.log('⚠️  db push не удался, пробуем migrate deploy...');
      try {
        execSync('npx prisma migrate deploy', {
          cwd: prismaDir,
          stdio: 'inherit',
          env: { ...process.env },
        });
        console.log('✅ Миграции успешно применены!\n');
      } catch (migrateError) {
        console.log('⚠️  migrate deploy не удался, пробуем migrate dev...');
        execSync('npx prisma migrate dev --name init', {
          cwd: prismaDir,
          stdio: 'inherit',
          env: { ...process.env },
        });
        console.log('✅ Миграции успешно созданы и применены!\n');
      }
    }

    // Генерируем Prisma Client
    console.log('🔨 Генерация Prisma Client...');
    execSync('npx prisma generate', {
      cwd: prismaDir,
      stdio: 'inherit',
      env: { ...process.env },
    });
    console.log('✅ Prisma Client успешно сгенерирован!\n');

    return true;
  } catch (error: any) {
    console.error('❌ Ошибка при применении миграций:');
    console.error(`   ${error.message}\n`);
    return false;
  }
}

// Главная функция
async function main() {
  console.log('🚀 Начало настройки базы данных...\n');

  // Шаг 1: Создание базы данных
  const dbCreated = await createDatabase();
  if (!dbCreated) {
    console.error('❌ Не удалось создать базу данных. Проверьте настройки подключения.\n');
    process.exit(1);
  }

  // Шаг 2: Применение миграций
  const migrationsApplied = await applyMigrations();
  if (!migrationsApplied) {
    console.error('❌ Не удалось применить миграции.\n');
    process.exit(1);
  }

  console.log('🎉 База данных успешно настроена!\n');
  console.log('📝 Следующие шаги:');
  console.log('   1. Проверьте подключение: npx prisma studio');
  console.log('   2. Запустите приложение: npm run dev');
  console.log('   3. (Опционально) Заполните тестовыми данными: npm run seed\n');
}

// Запуск
main().catch((error) => {
  console.error('💥 Критическая ошибка:');
  console.error(error);
  process.exit(1);
});

