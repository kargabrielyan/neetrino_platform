import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ImportService } from '../modules/import/import.service';
import { VendorsService } from '../modules/vendors/vendors.service';
import * as fs from 'fs';
import * as path from 'path';

async function importCsvFile() {
  console.log('🚀 Начинаем импорт CSV файла...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const importService = app.get(ImportService);
  const vendorsService = app.get(VendorsService);

  try {
    // Путь к CSV файлу
    const csvFilePath = path.join(process.cwd(), '..', '..', 'Товары-Export-2025-September-29-1558.csv');
    
    // Проверяем существование файла
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV файл не найден: ${csvFilePath}`);
    }

    console.log('📁 Найден CSV файл:', csvFilePath);
    
    // Получаем или создаем вендора для CSV импорта
    let vendor = await vendorsService.findByName('CSV Import Vendor');
    
    if (!vendor) {
      console.log('🔧 Создаем вендора для CSV импорта...');
      vendor = await vendorsService.create({
        name: 'CSV Import Vendor',
        website: 'https://neetrino.com',
        logoUrl: 'https://neetrino.com/logo.png',
        description: 'Вендор для товаров, импортированных из CSV файлов',
        status: 'active',
        metadata: {
          source: 'csv_import',
          createdBy: 'import_script',
          createdAt: new Date().toISOString()
        }
      });
      console.log('✅ Вендор создан:', vendor.id);
    } else {
      console.log('✅ Используем существующего вендора:', vendor.id);
    }

    // Читаем CSV файл
    const fileBuffer = fs.readFileSync(csvFilePath);
    console.log(`📊 Размер файла: ${fileBuffer.length} байт`);

    // Конфигурация импорта
    const config = {
      vendorId: vendor.id,
      updateExisting: true,
      skipInvalid: true
    };

    console.log('⚙️ Конфигурация импорта:', config);

    // Импортируем товары
    console.log('🔄 Начинаем импорт товаров...');
    const result = await importService.importFromCsv(fileBuffer, config);

    console.log('🎉 Импорт завершен!');
    console.log('📊 Результаты импорта:', {
      totalProcessed: result.totalProcessed,
      newProducts: result.newProducts,
      updatedProducts: result.updatedProducts,
      skippedProducts: result.skippedProducts,
      errors: result.errors,
      message: result.message
    });

    if (result.errorDetails && result.errorDetails.length > 0) {
      console.log('⚠️ Ошибки при импорте:');
      result.errorDetails.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Ошибка при импорте CSV:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Запускаем скрипт если он вызван напрямую
if (require.main === module) {
  importCsvFile()
    .then((result) => {
      console.log('🎉 Импорт завершен успешно!');
      console.log('📈 Итоговая статистика:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Ошибка импорта:', error);
      process.exit(1);
    });
}

export { importCsvFile };
