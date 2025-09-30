import { Injectable, Logger } from '@nestjs/common';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

export interface CsvProduct {
  sku: string;
  title: string;
  regularPrice: number;
  salePrice?: number;
  demoUrl: string;
  category: string;
  subcategory?: string;
  imageUrl: string;
  description?: string;
}

@Injectable()
export class CsvParserService {
  private readonly logger = new Logger(CsvParserService.name);

  /**
   * Парсит CSV файл и возвращает массив товаров
   */
  async parseCsvFile(fileBuffer: Buffer): Promise<CsvProduct[]> {
    return new Promise((resolve, reject) => {
      const products: CsvProduct[] = [];
      const stream = Readable.from(fileBuffer.toString());

      stream
        .pipe(csv({
          separator: ';',
          headers: [
            'sku',
            'title', 
            'regularPrice',
            'salePrice',
            'demoUrl',
            'category',
            'imageUrl',
            'description'
          ]
        }))
        .on('data', (row) => {
          try {
            // Пропускаем строки без названия или URL
            if (!row.title || !row.demoUrl) {
              return;
            }

            const product: CsvProduct = {
              sku: row.sku || '',
              title: row.title.trim(),
              regularPrice: this.parsePrice(row.regularPrice),
              salePrice: row.salePrice ? this.parsePrice(row.salePrice) : undefined,
              demoUrl: row.demoUrl.trim(),
              category: this.parseCategory(row.category),
              subcategory: this.parseSubcategory(row.category),
              imageUrl: row.imageUrl || '',
              description: row.description || ''
            };

            products.push(product);
          } catch (error) {
            this.logger.warn(`Ошибка при парсинге строки: ${JSON.stringify(row)}`, error);
          }
        })
        .on('end', () => {
          this.logger.log(`Успешно распарсено ${products.length} товаров из CSV файла`);
          resolve(products);
        })
        .on('error', (error) => {
          this.logger.error('Ошибка при парсинге CSV файла:', error);
          reject(error);
        });
    });
  }

  /**
   * Парсит цену из строки
   */
  private parsePrice(priceStr: string): number {
    if (!priceStr || priceStr.trim() === '') {
      return 0;
    }
    
    const price = parseFloat(priceStr.replace(/[^\d.,]/g, '').replace(',', '.'));
    return isNaN(price) ? 0 : price;
  }

  /**
   * Парсит категорию из строки вида "Website>Online Shop"
   */
  private parseCategory(categoryStr: string): string {
    if (!categoryStr || categoryStr.trim() === '') {
      return 'Other';
    }

    const parts = categoryStr.split('>');
    return parts[0]?.trim() || 'Other';
  }

  /**
   * Парсит подкатегорию из строки вида "Website>Online Shop"
   */
  private parseSubcategory(categoryStr: string): string | undefined {
    if (!categoryStr || categoryStr.trim() === '') {
      return undefined;
    }

    const parts = categoryStr.split('>');
    return parts[1]?.trim() || undefined;
  }

  /**
   * Нормализует URL для сравнения
   */
  normalizeUrl(url: string): string {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }
}
