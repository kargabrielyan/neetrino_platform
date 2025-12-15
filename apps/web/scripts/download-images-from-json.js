/**
 * Скрипт для скачивания всех изображений демо из JSON файла
 * Запуск: node scripts/download-images-from-json.js
 * 
 * Работает без базы данных - читает и обновляет JSON файл напрямую
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Пути
const JSON_FILE = path.join(__dirname, '..', '..', '..', 'data', 'demos.json');
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
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Создана папка: ${dir}`);
  }
}

/**
 * Получает расширение файла из URL
 */
function getExtension(url) {
  try {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
      return ext;
    }
  } catch (e) {}
  return '.jpg';
}

/**
 * Скачивает файл по URL
 */
function downloadFile(url, destPath) {
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
          // Если редирект относительный, делаем абсолютный
          let fullRedirectUrl = redirectUrl;
          if (redirectUrl.startsWith('/')) {
            const originalUrl = new URL(url);
            fullRedirectUrl = `${originalUrl.protocol}//${originalUrl.host}${redirectUrl}`;
          }
          downloadFile(fullRedirectUrl, destPath).then(resolve).catch(reject);
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
        fs.unlink(destPath, () => {});
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
function isExternalUrl(url) {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Задержка
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Обрабатывает одно демо
 */
async function processDemo(demo, index, total) {
  let updated = false;
  
  // Обработка imageUrl
  if (isExternalUrl(demo.imageUrl)) {
    const ext = getExtension(demo.imageUrl);
    const filename = `${demo.id}-image${ext}`;
    const localPath = path.join(IMAGES_DIR, filename);
    const localUrl = `/images/demos/${filename}`;
    
    if (fs.existsSync(localPath)) {
      // Файл уже скачан, просто обновляем URL
      demo.imageUrl = localUrl;
      stats.skipped++;
      updated = true;
    } else {
      try {
        await downloadFile(demo.imageUrl, localPath);
        console.log(`✅ [${index + 1}/${total}] Скачано: ${demo.id} (${demo.title?.substring(0, 40)}...)`);
        demo.imageUrl = localUrl;
        stats.downloaded++;
        updated = true;
      } catch (err) {
        console.log(`❌ [${index + 1}/${total}] Ошибка: ${demo.id} - ${err.message}`);
        stats.errors++;
      }
    }
  } else if (demo.imageUrl) {
    stats.alreadyLocal++;
  }
  
  // Обработка screenshotUrl (если есть)
  if (isExternalUrl(demo.screenshotUrl)) {
    const ext = getExtension(demo.screenshotUrl);
    const filename = `${demo.id}-screenshot${ext}`;
    const localPath = path.join(IMAGES_DIR, filename);
    const localUrl = `/images/demos/${filename}`;
    
    if (fs.existsSync(localPath)) {
      demo.screenshotUrl = localUrl;
      stats.skipped++;
      updated = true;
    } else {
      try {
        await downloadFile(demo.screenshotUrl, localPath);
        demo.screenshotUrl = localUrl;
        stats.downloaded++;
        updated = true;
      } catch (err) {
        stats.errors++;
      }
    }
  }
  
  return updated;
}

/**
 * Главная функция
 */
async function main() {
  console.log('🚀 Начинаем скачивание изображений из JSON...\n');
  console.log(`📂 JSON файл: ${JSON_FILE}`);
  console.log(`📂 Папка изображений: ${IMAGES_DIR}\n`);
  
  // Проверяем наличие JSON файла
  if (!fs.existsSync(JSON_FILE)) {
    console.error('❌ JSON файл не найден:', JSON_FILE);
    process.exit(1);
  }
  
  // Создаем папку для изображений
  ensureDir(IMAGES_DIR);
  
  // Читаем JSON
  console.log('📖 Читаем JSON файл...');
  const demos = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
  
  // Фильтруем только демо с внешними URL
  const demosWithExternalUrls = demos.filter(demo => 
    isExternalUrl(demo.imageUrl) || isExternalUrl(demo.screenshotUrl)
  );
  
  stats.total = demosWithExternalUrls.length;
  console.log(`📊 Найдено демо с внешними URL: ${stats.total}\n`);
  
  if (stats.total === 0) {
    console.log('✅ Все изображения уже локальные!');
    return;
  }
  
  // Обрабатываем каждое демо
  let saveCounter = 0;
  const SAVE_EVERY = 50; // Сохраняем каждые 50 демо
  
  for (let i = 0; i < demosWithExternalUrls.length; i++) {
    const demo = demosWithExternalUrls[i];
    const demoIndex = demos.findIndex(d => d.id === demo.id);
    
    const updated = await processDemo(demo, i, demosWithExternalUrls.length);
    
    if (updated && demoIndex !== -1) {
      demos[demoIndex] = demo;
      saveCounter++;
    }
    
    // Периодическое сохранение
    if (saveCounter >= SAVE_EVERY) {
      console.log(`\n💾 Сохраняем прогресс (${i + 1}/${demosWithExternalUrls.length})...\n`);
      fs.writeFileSync(JSON_FILE, JSON.stringify(demos, null, 2));
      saveCounter = 0;
    }
    
    // Небольшая задержка между запросами
    await sleep(100);
  }
  
  // Финальное сохранение
  console.log('\n💾 Сохраняем финальный JSON...');
  fs.writeFileSync(JSON_FILE, JSON.stringify(demos, null, 2));
  
  // Итоги
  console.log('\n' + '='.repeat(50));
  console.log('📊 ИТОГИ:');
  console.log(`   Всего с внешними URL: ${stats.total}`);
  console.log(`   ✅ Скачано: ${stats.downloaded}`);
  console.log(`   ⏭️  Пропущено (уже есть): ${stats.skipped}`);
  console.log(`   📁 Уже локальные: ${stats.alreadyLocal}`);
  console.log(`   ❌ Ошибок: ${stats.errors}`);
  console.log('='.repeat(50));
  console.log('\n✅ Готово! JSON файл обновлен.');
}

// Запуск
main().catch((e) => {
  console.error('❌ Критическая ошибка:', e);
  process.exit(1);
});



