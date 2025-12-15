/**
 * Скрипт для скачивания всех изображений демо локально
 * Запуск: npx ts-node scripts/download-images.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const prisma = new PrismaClient();

// Папка для сохранения изображений
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'demos');

// Статистика
let stats = {
  total: 0,
  downloaded: 0,
  skipped: 0,
  errors: 0,
  alreadyLocal: 0,
};

/**
 * Создает папку если не существует
 */
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Создана папка: ${dir}`);
  }
}

/**
 * Получает расширение файла из URL
 */
function getExtension(url: string): string {
  try {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
      return ext;
    }
  } catch (e) {}
  return '.jpg'; // По умолчанию jpg
}

/**
 * Скачивает файл по URL
 */
function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { 
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      // Обработка редиректов
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {}); // Удаляем частичный файл
        reject(err);
      });
    });
    
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

/**
 * Проверяет, является ли URL внешним
 */
function isExternalUrl(url: string | null): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Обрабатывает одно демо
 */
async function processDemo(demo: any): Promise<{ imageUrl?: string; screenshotUrl?: string }> {
  const updates: { imageUrl?: string; screenshotUrl?: string } = {};
  
  // Обработка imageUrl
  if (isExternalUrl(demo.imageUrl)) {
    const ext = getExtension(demo.imageUrl);
    const filename = `${demo.id}-image${ext}`;
    const localPath = path.join(IMAGES_DIR, filename);
    const localUrl = `/images/demos/${filename}`;
    
    if (fs.existsSync(localPath)) {
      console.log(`⏭️  Уже скачано: ${demo.id} (image)`);
      stats.skipped++;
      updates.imageUrl = localUrl;
    } else {
      try {
        await downloadFile(demo.imageUrl, localPath);
        console.log(`✅ Скачано: ${demo.id} (image)`);
        stats.downloaded++;
        updates.imageUrl = localUrl;
      } catch (err: any) {
        console.log(`❌ Ошибка: ${demo.id} (image) - ${err.message}`);
        stats.errors++;
      }
    }
  } else if (demo.imageUrl) {
    stats.alreadyLocal++;
  }
  
  // Обработка screenshotUrl
  if (isExternalUrl(demo.screenshotUrl)) {
    const ext = getExtension(demo.screenshotUrl);
    const filename = `${demo.id}-screenshot${ext}`;
    const localPath = path.join(IMAGES_DIR, filename);
    const localUrl = `/images/demos/${filename}`;
    
    if (fs.existsSync(localPath)) {
      console.log(`⏭️  Уже скачано: ${demo.id} (screenshot)`);
      stats.skipped++;
      updates.screenshotUrl = localUrl;
    } else {
      try {
        await downloadFile(demo.screenshotUrl, localPath);
        console.log(`✅ Скачано: ${demo.id} (screenshot)`);
        stats.downloaded++;
        updates.screenshotUrl = localUrl;
      } catch (err: any) {
        console.log(`❌ Ошибка: ${demo.id} (screenshot) - ${err.message}`);
        stats.errors++;
      }
    }
  } else if (demo.screenshotUrl) {
    stats.alreadyLocal++;
  }
  
  return updates;
}

/**
 * Главная функция
 */
async function main() {
  console.log('🚀 Начинаем скачивание изображений...\n');
  
  // Создаем папку
  ensureDir(IMAGES_DIR);
  
  // Получаем все демо с внешними URL
  const demos = await prisma.demo.findMany({
    where: {
      OR: [
        { imageUrl: { startsWith: 'http' } },
        { screenshotUrl: { startsWith: 'http' } },
      ],
    },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      screenshotUrl: true,
    },
  });
  
  stats.total = demos.length;
  console.log(`📊 Найдено демо с внешними URL: ${demos.length}\n`);
  
  // Обрабатываем пакетами по 5 для скорости
  const BATCH_SIZE = 5;
  
  for (let i = 0; i < demos.length; i += BATCH_SIZE) {
    const batch = demos.slice(i, i + BATCH_SIZE);
    
    const results = await Promise.all(
      batch.map(async (demo) => {
        const updates = await processDemo(demo);
        return { id: demo.id, updates };
      })
    );
    
    // Обновляем БД
    for (const { id, updates } of results) {
      if (Object.keys(updates).length > 0) {
        await prisma.demo.update({
          where: { id },
          data: updates,
        });
      }
    }
    
    // Прогресс
    const progress = Math.min(i + BATCH_SIZE, demos.length);
    console.log(`\n📈 Прогресс: ${progress}/${demos.length} (${Math.round(progress/demos.length*100)}%)\n`);
  }
  
  // Итоги
  console.log('\n' + '='.repeat(50));
  console.log('📊 ИТОГИ:');
  console.log(`   Всего демо: ${stats.total}`);
  console.log(`   ✅ Скачано: ${stats.downloaded}`);
  console.log(`   ⏭️  Пропущено (уже есть): ${stats.skipped}`);
  console.log(`   📁 Уже локальные: ${stats.alreadyLocal}`);
  console.log(`   ❌ Ошибок: ${stats.errors}`);
  console.log('='.repeat(50));
}

// Запуск
main()
  .catch((e) => {
    console.error('❌ Критическая ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




