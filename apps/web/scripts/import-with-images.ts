/**
 * Скрипт импорта демо из JSON с скачиванием картинок
 * 
 * Функционал:
 * 1. Очищает все демо из базы данных
 * 2. Читает demos.json
 * 3. Скачивает картинки в public/images/demos/
 * 4. Обновляет imageUrl на локальный путь
 * 5. Импортирует в базу Prisma
 * 
 * Запуск: npx ts-node scripts/import-with-images.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { fileURLToPath } from 'url';

// Для ESM модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Конфигурация
const CONFIG = {
  jsonPath: path.resolve(__dirname, '../../../data/demos.json'),
  imagesDir: path.resolve(__dirname, '../public/images/demos'),
  batchSize: 50, // Сколько записей обрабатывать за раз
  downloadTimeout: 10000, // Таймаут скачивания картинки (10 сек)
  skipExistingImages: true, // Пропускать уже скачанные картинки
  maxRetries: 3, // Максимум попыток скачивания
};

// Статистика
const stats = {
  total: 0,
  imported: 0,
  imagesDownloaded: 0,
  imagesSkipped: 0,
  imagesFailed: 0,
  errors: 0,
};

// Интерфейс для демо из JSON
interface DemoJson {
  id: string;
  title: string;
  description?: string;
  url: string;
  normalizedUrl?: string;
  category?: string;
  subcategory?: string;
  imageUrl?: string;
  status?: string;
  vendorId?: string;
  metadata?: {
    sku?: string;
    regularPrice?: number;
    salePrice?: number;
    source?: string;
    importedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Скачивает картинку по URL
 */
async function downloadImage(url: string, filepath: string, retries = 0): Promise<boolean> {
  return new Promise((resolve) => {
    // Проверяем, существует ли уже файл
    if (CONFIG.skipExistingImages && fs.existsSync(filepath)) {
      stats.imagesSkipped++;
      resolve(true);
      return;
    }

    // Валидация URL
    if (!url || url === 'Image URL' || !url.startsWith('http')) {
      resolve(false);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    
    const timeout = setTimeout(() => {
      stats.imagesFailed++;
      resolve(false);
    }, CONFIG.downloadTimeout);

    try {
      const request = protocol.get(url, { 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/*'
        }
      }, (response) => {
        clearTimeout(timeout);

        // Обработка редиректов
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            downloadImage(redirectUrl, filepath, retries).then(resolve);
            return;
          }
        }

        if (response.statusCode !== 200) {
          if (retries < CONFIG.maxRetries) {
            setTimeout(() => {
              downloadImage(url, filepath, retries + 1).then(resolve);
            }, 1000);
            return;
          }
          stats.imagesFailed++;
          resolve(false);
          return;
        }

        // Создаём директорию если не существует
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          stats.imagesDownloaded++;
          resolve(true);
        });

        fileStream.on('error', () => {
          fs.unlink(filepath, () => {});
          stats.imagesFailed++;
          resolve(false);
        });
      });

      request.on('error', () => {
        clearTimeout(timeout);
        if (retries < CONFIG.maxRetries) {
          setTimeout(() => {
            downloadImage(url, filepath, retries + 1).then(resolve);
          }, 1000);
          return;
        }
        stats.imagesFailed++;
        resolve(false);
      });

    } catch (error) {
      clearTimeout(timeout);
      stats.imagesFailed++;
      resolve(false);
    }
  });
}

/**
 * Генерирует имя файла из URL
 */
function getImageFilename(url: string, id: string): string {
  if (!url || url === 'Image URL') return '';
  
  try {
    const urlObj = new URL(url);
    const ext = path.extname(urlObj.pathname) || '.jpg';
    // Используем ID демо + расширение для уникальности
    return `${id}${ext}`;
  } catch {
    return `${id}.jpg`;
  }
}

/**
 * Очищает базу данных от демо
 */
async function clearDatabase(): Promise<void> {
  console.log('🗑️  Очистка базы данных...');
  
  // Сначала удаляем связанные записи
  await prisma.checkRun.deleteMany({});
  await prisma.wishlist.deleteMany({});
  
  // Проверяем есть ли заказы или подписки
  const ordersCount = await prisma.order.count();
  const subscriptionsCount = await prisma.subscription.count();
  
  if (ordersCount > 0 || subscriptionsCount > 0) {
    console.log(`⚠️  Найдено ${ordersCount} заказов и ${subscriptionsCount} подписок`);
    console.log('⚠️  Демо со связанными заказами/подписками будут помечены как deleted');
    
    // Помечаем демо как deleted вместо удаления
    await prisma.demo.updateMany({
      data: { status: 'deleted' }
    });
  } else {
    // Если нет связанных данных - удаляем полностью
    await prisma.demo.deleteMany({});
  }
  
  console.log('✅ База данных очищена');
}

/**
 * Создаёт или находит вендора
 */
async function getOrCreateVendor(name: string = 'Neetrino'): Promise<string> {
  let vendor = await prisma.vendor.findFirst({
    where: { name }
  });
  
  if (!vendor) {
    vendor = await prisma.vendor.create({
      data: {
        name,
        website: 'https://neetrino.com',
        status: 'active'
      }
    });
    console.log(`✅ Создан вендор: ${name}`);
  }
  
  return vendor.id;
}

/**
 * Импортирует демо в базу
 */
async function importDemo(demo: DemoJson, vendorId: string): Promise<boolean> {
  try {
    // Скачиваем картинку
    let localImageUrl = '';
    if (demo.imageUrl && demo.imageUrl !== 'Image URL' && demo.imageUrl.startsWith('http')) {
      const filename = getImageFilename(demo.imageUrl, demo.id);
      if (filename) {
        const filepath = path.join(CONFIG.imagesDir, filename);
        const downloaded = await downloadImage(demo.imageUrl, filepath);
        if (downloaded) {
          localImageUrl = `/images/demos/${filename}`;
        }
      }
    }

    // Создаём запись в базе
    await prisma.demo.create({
      data: {
        title: demo.title || 'Без названия',
        description: demo.description || '',
        url: demo.url || '',
        normalizedUrl: demo.normalizedUrl || demo.url || '',
        status: demo.status || 'active',
        category: demo.category || '',
        subcategory: demo.subcategory || '',
        imageUrl: localImageUrl || demo.imageUrl || '',
        screenshotUrl: localImageUrl || demo.imageUrl || '',
        sku: demo.metadata?.sku || '',
        regularPrice: demo.metadata?.regularPrice || null,
        salePrice: demo.metadata?.salePrice || null,
        vendorId: vendorId,
        metadata: demo.metadata ? JSON.parse(JSON.stringify(demo.metadata)) : null,
        viewCount: 0,
        isAccessible: true
      }
    });

    stats.imported++;
    return true;
  } catch (error) {
    stats.errors++;
    console.error(`❌ Ошибка импорта ${demo.id}:`, error);
    return false;
  }
}

/**
 * Основная функция импорта
 */
async function main(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 ИМПОРТ ДЕМО СО СКАЧИВАНИЕМ КАРТИНОК');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  // Проверяем наличие JSON файла
  if (!fs.existsSync(CONFIG.jsonPath)) {
    console.error(`❌ Файл не найден: ${CONFIG.jsonPath}`);
    process.exit(1);
  }

  // Создаём папку для картинок
  if (!fs.existsSync(CONFIG.imagesDir)) {
    fs.mkdirSync(CONFIG.imagesDir, { recursive: true });
    console.log(`📁 Создана папка: ${CONFIG.imagesDir}`);
  }

  // Читаем JSON
  console.log('📖 Чтение JSON файла...');
  const jsonContent = fs.readFileSync(CONFIG.jsonPath, 'utf-8');
  const demos: DemoJson[] = JSON.parse(jsonContent);
  stats.total = demos.length;
  console.log(`📊 Найдено записей: ${stats.total}`);
  console.log('');

  // Фильтруем невалидные записи
  const validDemos = demos.filter(d => 
    d.title && 
    d.title !== 'Title' && 
    d.url && 
    d.url !== 'custom_product_link'
  );
  console.log(`✅ Валидных записей: ${validDemos.length}`);
  console.log('');

  // Очищаем базу
  await clearDatabase();
  console.log('');

  // Получаем или создаём вендора
  const vendorId = await getOrCreateVendor('Neetrino');
  console.log('');

  // Импортируем батчами
  console.log('📥 Начинаем импорт...');
  console.log('');

  const startTime = Date.now();
  
  for (let i = 0; i < validDemos.length; i += CONFIG.batchSize) {
    const batch = validDemos.slice(i, i + CONFIG.batchSize);
    
    // Обрабатываем батч параллельно (но не слишком много одновременно)
    await Promise.all(batch.map(demo => importDemo(demo, vendorId)));

    // Прогресс
    const progress = Math.round(((i + batch.length) / validDemos.length) * 100);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const eta = Math.round((elapsed / (i + batch.length)) * (validDemos.length - i - batch.length));
    
    process.stdout.write(`\r⏳ Прогресс: ${progress}% | Импортировано: ${stats.imported} | Картинок: ${stats.imagesDownloaded} | Пропущено: ${stats.imagesSkipped} | Ошибок: ${stats.errors} | ETA: ${eta}s   `);
  }

  console.log('\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 РЕЗУЛЬТАТЫ ИМПОРТА');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`   Всего записей в JSON:     ${stats.total}`);
  console.log(`   Импортировано в базу:     ${stats.imported}`);
  console.log(`   Картинок скачано:         ${stats.imagesDownloaded}`);
  console.log(`   Картинок пропущено:       ${stats.imagesSkipped}`);
  console.log(`   Картинок с ошибкой:       ${stats.imagesFailed}`);
  console.log(`   Ошибок импорта:           ${stats.errors}`);
  console.log(`   Время выполнения:         ${Math.round((Date.now() - startTime) / 1000)} сек`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('✅ Импорт завершён!');
}

// Запуск
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

