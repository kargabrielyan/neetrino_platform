import { BadRequestException } from '@nestjs/common';

// Разрешенные MIME-типы для CSV файлов
const ALLOWED_MIME_TYPES = [
  'text/csv',
  'text/plain',
  'application/csv',
  'application/vnd.ms-excel',
];

// Разрешенные расширения файлов
const ALLOWED_EXTENSIONS = ['.csv', '.txt'];

// Magic bytes для CSV (первые байты файла)
const CSV_MAGIC_BYTES = [
  Buffer.from('ID,'), // CSV с заголовком ID
  Buffer.from('id,'), // CSV с заголовком id
  Buffer.from('SKU,'), // CSV с заголовком SKU
  Buffer.from('sku,'), // CSV с заголовком sku
];

/**
 * Проверяет, является ли файл валидным CSV
 */
export function validateCsvFile(file: Express.Multer.File): void {
  if (!file) {
    throw new BadRequestException('File is required');
  }

  // Проверка размера файла (уже проверяется Multer, но для надежности)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    throw new BadRequestException(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
  }

  // Проверка расширения файла
  const fileExtension = file.originalname
    .toLowerCase()
    .substring(file.originalname.lastIndexOf('.'));
  
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    throw new BadRequestException(
      `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
    );
  }

  // Проверка MIME-типа
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new BadRequestException(
      `Invalid file type. Allowed MIME types: ${ALLOWED_MIME_TYPES.join(', ')}`
    );
  }

  // Проверка содержимого файла (magic bytes)
  if (file.buffer) {
    const isValidCsv = CSV_MAGIC_BYTES.some(magicBytes => 
      file.buffer.slice(0, magicBytes.length).equals(magicBytes)
    ) || file.buffer.toString('utf8', 0, 100).includes(','); // Или просто содержит запятую в первых 100 байтах

    if (!isValidCsv) {
      // Не строгая проверка - если файл содержит запятую, считаем его CSV
      const firstBytes = file.buffer.toString('utf8', 0, 100);
      if (!firstBytes.includes(',')) {
        throw new BadRequestException('File does not appear to be a valid CSV file');
      }
    }
  }

  // Проверка имени файла на опасные символы
  const dangerousChars = /[<>:"|?*\x00-\x1f]/;
  if (dangerousChars.test(file.originalname)) {
    throw new BadRequestException('File name contains invalid characters');
  }
}

/**
 * Генерирует безопасное имя файла (UUID + расширение)
 */
export function generateSafeFileName(originalName: string): string {
  const extension = originalName.substring(originalName.lastIndexOf('.'));
  const uuid = require('crypto').randomUUID();
  return `${uuid}${extension}`;
}





