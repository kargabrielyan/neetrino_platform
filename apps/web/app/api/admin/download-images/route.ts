/**
 * API для скачивания изображений демо локально
 * POST /api/admin/download-images
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// Папка для сохранения изображений
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'demos');

/**
 * Создает папку если не существует
 */
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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
  return '.jpg';
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
function isExternalUrl(url: string | null): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

export async function POST(request: NextRequest) {
  console.log('🚀 [Download Images] Начинаем скачивание...');
  
  try {
    // Проверка Prisma
    if (!prisma) {
      return NextResponse.json(
        { error: 'База данных недоступна' },
        { status: 500 }
      );
    }
    
    // Создаем папку
    ensureDir(IMAGES_DIR);
    console.log(`📁 [Download Images] Папка: ${IMAGES_DIR}`);
    
    // Получаем параметры (limit для ограничения)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1000');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Получаем демо с внешними URL
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
      take: limit,
      skip: skip,
    });
    
    console.log(`📊 [Download Images] Найдено демо: ${demos.length}`);
    
    const stats = {
      total: demos.length,
      downloaded: 0,
      skipped: 0,
      errors: 0,
      errorList: [] as string[],
    };
    
    // Обрабатываем каждое демо
    for (const demo of demos) {
      // Обработка imageUrl
      if (isExternalUrl(demo.imageUrl)) {
        const ext = getExtension(demo.imageUrl!);
        const filename = `${demo.id}-image${ext}`;
        const localPath = path.join(IMAGES_DIR, filename);
        const localUrl = `/images/demos/${filename}`;
        
        if (fs.existsSync(localPath)) {
          console.log(`⏭️  [Download Images] Уже есть: ${demo.id}`);
          stats.skipped++;
          // Обновляем URL в БД
          await prisma.demo.update({
            where: { id: demo.id },
            data: { imageUrl: localUrl },
          });
        } else {
          try {
            await downloadFile(demo.imageUrl!, localPath);
            console.log(`✅ [Download Images] Скачано: ${demo.id}`);
            stats.downloaded++;
            // Обновляем URL в БД
            await prisma.demo.update({
              where: { id: demo.id },
              data: { imageUrl: localUrl },
            });
          } catch (err: any) {
            console.log(`❌ [Download Images] Ошибка: ${demo.id} - ${err.message}`);
            stats.errors++;
            stats.errorList.push(`${demo.id}: ${err.message}`);
          }
        }
      }
      
      // Обработка screenshotUrl
      if (isExternalUrl(demo.screenshotUrl)) {
        const ext = getExtension(demo.screenshotUrl!);
        const filename = `${demo.id}-screenshot${ext}`;
        const localPath = path.join(IMAGES_DIR, filename);
        const localUrl = `/images/demos/${filename}`;
        
        if (fs.existsSync(localPath)) {
          stats.skipped++;
          await prisma.demo.update({
            where: { id: demo.id },
            data: { screenshotUrl: localUrl },
          });
        } else {
          try {
            await downloadFile(demo.screenshotUrl!, localPath);
            stats.downloaded++;
            await prisma.demo.update({
              where: { id: demo.id },
              data: { screenshotUrl: localUrl },
            });
          } catch (err: any) {
            stats.errors++;
            stats.errorList.push(`${demo.id} (screenshot): ${err.message}`);
          }
        }
      }
    }
    
    console.log('✅ [Download Images] Завершено!');
    console.log(`   Скачано: ${stats.downloaded}`);
    console.log(`   Пропущено: ${stats.skipped}`);
    console.log(`   Ошибок: ${stats.errors}`);
    
    return NextResponse.json({
      success: true,
      stats,
      message: `Обработано ${stats.total} демо. Скачано: ${stats.downloaded}, Пропущено: ${stats.skipped}, Ошибок: ${stats.errors}`,
    });
    
  } catch (error: any) {
    console.error('❌ [Download Images] Критическая ошибка:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка скачивания' },
      { status: 500 }
    );
  }
}

// GET для проверки статуса
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'База данных недоступна' 
      });
    }
    
    // Считаем демо с внешними и локальными URL
    const externalCount = await prisma.demo.count({
      where: {
        OR: [
          { imageUrl: { startsWith: 'http' } },
          { screenshotUrl: { startsWith: 'http' } },
        ],
      },
    });
    
    const localCount = await prisma.demo.count({
      where: {
        OR: [
          { imageUrl: { startsWith: '/images' } },
          { screenshotUrl: { startsWith: '/images' } },
        ],
      },
    });
    
    const totalCount = await prisma.demo.count();
    
    // Проверяем папку
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'demos');
    let filesCount = 0;
    if (fs.existsSync(imagesDir)) {
      filesCount = fs.readdirSync(imagesDir).length;
    }
    
    return NextResponse.json({
      status: 'ok',
      stats: {
        totalDemos: totalCount,
        withExternalUrl: externalCount,
        withLocalUrl: localCount,
        filesInFolder: filesCount,
      },
      message: externalCount > 0 
        ? `Осталось скачать: ${externalCount} изображений`
        : 'Все изображения скачаны!',
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    });
  }
}




