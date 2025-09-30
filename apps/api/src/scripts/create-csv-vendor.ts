import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { VendorsService } from '../modules/vendors/vendors.service';

async function createCsvVendor() {
  console.log('🚀 Создаем вендора для CSV импорта...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const vendorsService = app.get(VendorsService);

  try {
    // Проверяем, существует ли уже вендор для CSV импорта
    const existingVendor = await vendorsService.findByName('CSV Import Vendor');
    
    if (existingVendor) {
      console.log('✅ Вендор для CSV импорта уже существует:', existingVendor.id);
      return existingVendor.id;
    }

    // Создаем нового вендора
    const vendor = await vendorsService.create({
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

    console.log('✅ Вендор для CSV импорта создан:', vendor.id);
    console.log('📊 Детали вендора:', {
      id: vendor.id,
      name: vendor.name,
      website: vendor.website,
      status: vendor.status
    });

    return vendor.id;
  } catch (error) {
    console.error('❌ Ошибка при создании вендора:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Запускаем скрипт если он вызван напрямую
if (require.main === module) {
  createCsvVendor()
    .then((vendorId) => {
      console.log('🎉 Вендор создан успешно! ID:', vendorId);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Ошибка:', error);
      process.exit(1);
    });
}

export { createCsvVendor };
