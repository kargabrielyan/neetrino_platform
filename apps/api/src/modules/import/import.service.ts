import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportRun } from './entities/import-run.entity';
import { Demo } from '../demos/demo.entity';
import { Vendor } from '../vendors/vendor.entity';
import { ImportDiffDto, ImportDiffItemDto, ConfirmImportDto } from './dto/import-diff.dto';
import { WooCommerceService } from './services/woocommerce.service';
import { CsvParserService, CsvProduct } from './services/csv-parser.service';
import { CsvImportResultDto, CsvImportConfigDto } from './dto/csv-import.dto';
import { 
  WooCommerceImportConfigDto, 
  WooCommerceImportResultDto, 
  WooCommerceSyncResultDto 
} from './dto/woocommerce.dto';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    @InjectRepository(ImportRun)
    private importRunRepository: Repository<ImportRun>,
    @InjectRepository(Demo)
    private demoRepository: Repository<Demo>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    private readonly wooCommerceService: WooCommerceService,
    private readonly csvParserService: CsvParserService,
  ) {}

  async startImport(vendorId: string): Promise<ImportRun> {
    const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    const importRun = this.importRunRepository.create({
      vendorId,
      startedAt: new Date(),
      status: 'running',
    });

    return await this.importRunRepository.save(importRun);
  }

  async getImportRuns(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: ImportRun[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.importRunRepository.findAndCount({
      relations: ['vendor'],
      order: { startedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async getImportRun(id: string): Promise<ImportRun> {
    const importRun = await this.importRunRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });

    if (!importRun) {
      throw new NotFoundException(`Import run with ID ${id} not found`);
    }

    return importRun;
  }

  /**
   * Получает продукты из WooCommerce и сравнивает с существующими
   */
  async getWooCommerceDiff(config: WooCommerceImportConfigDto): Promise<WooCommerceImportResultDto> {
    const vendor = await this.vendorRepository.findOne({ where: { id: config.vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${config.vendorId} not found`);
    }

    this.logger.log(`Starting WooCommerce import for vendor: ${vendor.name}`);

    // Получаем все продукты из WooCommerce
    const wooProducts = await this.wooCommerceService.getAllProducts(config);
    const filteredProducts = this.wooCommerceService.filterProducts(wooProducts, config);

    this.logger.log(`Found ${filteredProducts.length} products after filtering`);

    const items = [];
    let totalNew = 0;
    let totalExisting = 0;
    let totalToUpdate = 0;

    for (const product of filteredProducts) {
      const importItem = this.wooCommerceService.transformProductToImportItem(product, config);
      const normalizedUrl = this.normalizeUrl(importItem.url);

      // Проверяем, существует ли уже такой демо
      const existingDemo = await this.demoRepository.findOne({
        where: { normalizedUrl },
      });

      if (!existingDemo) {
        importItem.status = 'new';
        totalNew++;
      } else {
        // Проверяем, нужно ли обновить существующий демо
        const needsUpdate = this.shouldUpdateDemo(existingDemo, product);
        if (needsUpdate) {
          importItem.status = 'update';
          totalToUpdate++;
        } else {
          importItem.status = 'existing';
          totalExisting++;
        }
      }

      items.push(importItem);
    }

    this.logger.log(`Import analysis complete: ${totalNew} new, ${totalExisting} existing, ${totalToUpdate} to update`);

    return {
      totalFound: filteredProducts.length,
      totalNew,
      totalExisting,
      totalToUpdate,
      items,
    };
  }

  /**
   * Проверяет, нужно ли обновить существующий демо
   */
  private shouldUpdateDemo(existingDemo: Demo, wooProduct: any): boolean {
    // Проверяем различные поля на изменения
    const nameChanged = existingDemo.title !== wooProduct.name;
    const descriptionChanged = existingDemo.description !== wooProduct.description;
    const imageChanged = existingDemo.imageUrl !== (wooProduct.images?.[0]?.src || '');
    
    return nameChanged || descriptionChanged || imageChanged;
  }

  /**
   * Синхронизирует выбранные продукты из WooCommerce
   */
  async syncWooCommerceProducts(
    config: WooCommerceImportConfigDto,
    selectedItems: Array<{ woocommerceId: number; status: string }>
  ): Promise<WooCommerceSyncResultDto> {
    const vendor = await this.vendorRepository.findOne({ where: { id: config.vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${config.vendorId} not found`);
    }

    this.logger.log(`Starting WooCommerce sync for ${selectedItems.length} products`);

    let imported = 0;
    let updated = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    for (const item of selectedItems) {
      try {
        // Получаем полную информацию о продукте из WooCommerce
        const wooProduct = await this.wooCommerceService.getProductById(config, item.woocommerceId);
        const importItem = this.wooCommerceService.transformProductToImportItem(wooProduct, config);
        const normalizedUrl = this.normalizeUrl(importItem.url);

        if (item.status === 'new') {
          // Создаем новый демо
          const demo = this.demoRepository.create({
            title: importItem.name,
            description: wooProduct.description || wooProduct.short_description,
            url: importItem.url,
            normalizedUrl,
            vendorId: config.vendorId,
            status: 'active',
            category: importItem.category,
            imageUrl: importItem.imageUrl,
            metadata: {
              woocommerceId: wooProduct.id,
              woocommerceSlug: wooProduct.slug,
              price: importItem.price,
              categories: wooProduct.categories,
              tags: wooProduct.tags,
              lastSyncAt: new Date(),
            },
          });

          await this.demoRepository.save(demo);
          imported++;
          this.logger.log(`Imported new demo: ${importItem.name}`);

        } else if (item.status === 'update') {
          // Обновляем существующий демо
          const existingDemo = await this.demoRepository.findOne({
            where: { normalizedUrl },
          });

          if (existingDemo) {
            existingDemo.title = importItem.name;
            existingDemo.description = wooProduct.description || wooProduct.short_description;
            existingDemo.imageUrl = importItem.imageUrl;
            existingDemo.category = importItem.category;
            existingDemo.metadata = {
              ...existingDemo.metadata,
              woocommerceId: wooProduct.id,
              woocommerceSlug: wooProduct.slug,
              price: importItem.price,
              categories: wooProduct.categories,
              tags: wooProduct.tags,
              lastSyncAt: new Date(),
            };

            await this.demoRepository.save(existingDemo);
            updated++;
            this.logger.log(`Updated demo: ${importItem.name}`);
          }

        } else if (item.status === 'existing') {
          // Просто обновляем метаданные
          const existingDemo = await this.demoRepository.findOne({
            where: { normalizedUrl },
          });

          if (existingDemo) {
            existingDemo.metadata = {
              ...existingDemo.metadata,
              woocommerceId: wooProduct.id,
              woocommerceSlug: wooProduct.slug,
              price: importItem.price,
              categories: wooProduct.categories,
              tags: wooProduct.tags,
              lastSyncAt: new Date(),
            };

            await this.demoRepository.save(existingDemo);
            this.logger.log(`Updated metadata for demo: ${importItem.name}`);
          }
        }

      } catch (error) {
        errors++;
        const errorMsg = `Failed to sync product ${item.woocommerceId}: ${error.message}`;
        errorDetails.push(errorMsg);
        this.logger.error(errorMsg, error);
      }
    }

    // Обновляем счетчик демо у вендора
    await this.updateVendorDemoCount(config.vendorId);

    this.logger.log(`WooCommerce sync complete: ${imported} imported, ${updated} updated, ${errors} errors`);

    return {
      totalProcessed: selectedItems.length,
      imported,
      updated,
      errors,
      errorDetails,
    };
  }

  /**
   * Тестирует подключение к WooCommerce
   */
  async testWooCommerceConnection(config: WooCommerceImportConfigDto): Promise<{ success: boolean; message: string }> {
    try {
      const isConnected = await this.wooCommerceService.testConnection(config);
      
      if (isConnected) {
        return {
          success: true,
          message: 'Successfully connected to WooCommerce store',
        };
      } else {
        return {
          success: false,
          message: 'Failed to connect to WooCommerce store. Please check your credentials.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error.message}`,
      };
    }
  }

  /**
   * Получает категории из WooCommerce
   */
  async getWooCommerceCategories(config: WooCommerceImportConfigDto): Promise<any[]> {
    return await this.wooCommerceService.getCategories(config);
  }

  async confirmImport(confirmImportDto: ConfirmImportDto): Promise<{ imported: number; errors: string[] }> {
    const vendor = await this.vendorRepository.findOne({ where: { id: confirmImportDto.vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${confirmImportDto.vendorId} not found`);
    }

    const imported: Demo[] = [];
    const errors: string[] = [];

    for (const url of confirmImportDto.urls) {
      try {
        const demo = this.demoRepository.create({
          title: `Demo from ${vendor.name}`,
          url,
          normalizedUrl: this.normalizeUrl(url),
          vendorId: confirmImportDto.vendorId,
          status: 'active',
        });

        const savedDemo = await this.demoRepository.save(demo);
        imported.push(savedDemo);
      } catch (error) {
        errors.push(`Failed to import ${url}: ${error.message}`);
      }
    }

    // Обновляем счетчик демо у вендора
    await this.updateVendorDemoCount(confirmImportDto.vendorId);

    return { imported: imported.length, errors };
  }

  private async updateVendorDemoCount(vendorId: string): Promise<void> {
    const count = await this.demoRepository.count({
      where: { vendorId, status: 'active' },
    });

    await this.vendorRepository.update(vendorId, { demoCount: count });
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }

  /**
   * Импортирует товары из CSV файла
   */
  async importFromCsv(fileBuffer: Buffer, config: CsvImportConfigDto): Promise<CsvImportResultDto> {
    this.logger.log(`🚀 Начинаем импорт CSV файла для вендора ${config.vendorId}`);
    
    // Проверяем существование вендора
    const vendor = await this.vendorRepository.findOne({ where: { id: config.vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Вендор с ID ${config.vendorId} не найден`);
    }

    // Парсим CSV файл
    const csvProducts = await this.csvParserService.parseCsvFile(fileBuffer);
    this.logger.log(`📊 Распарсено ${csvProducts.length} товаров из CSV файла`);

    let newProducts = 0;
    let updatedProducts = 0;
    let skippedProducts = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    // Обрабатываем каждый товар
    for (const csvProduct of csvProducts) {
      try {
        // Пропускаем товары без URL если включена опция
        if (config.skipInvalid && !csvProduct.demoUrl) {
          skippedProducts++;
          continue;
        }

        const normalizedUrl = this.csvParserService.normalizeUrl(csvProduct.demoUrl);
        
        // Ищем существующий демо
        const existingDemo = await this.demoRepository.findOne({
          where: { normalizedUrl }
        });

        if (existingDemo) {
          // Обновляем существующий демо если включена опция
          if (config.updateExisting) {
            await this.updateDemoFromCsv(existingDemo, csvProduct);
            updatedProducts++;
            this.logger.log(`✅ Обновлен демо: ${csvProduct.title}`);
          } else {
            skippedProducts++;
            this.logger.log(`⏭️ Пропущен существующий демо: ${csvProduct.title}`);
          }
        } else {
          // Создаем новый демо
          await this.createDemoFromCsv(csvProduct, vendor.id);
          newProducts++;
          this.logger.log(`➕ Создан новый демо: ${csvProduct.title}`);
        }
      } catch (error) {
        errors++;
        const errorMsg = `Ошибка при обработке товара "${csvProduct.title}": ${error.message}`;
        errorDetails.push(errorMsg);
        this.logger.error(`❌ ${errorMsg}`);
      }
    }

    const result: CsvImportResultDto = {
      totalProcessed: csvProducts.length,
      newProducts,
      updatedProducts,
      skippedProducts,
      errors,
      message: `Импорт завершен: ${newProducts} новых, ${updatedProducts} обновленных, ${skippedProducts} пропущенных, ${errors} ошибок`,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined
    };

    this.logger.log(`🎉 Импорт CSV завершен: ${result.message}`);
    return result;
  }

  /**
   * Создает новый демо из CSV товара
   */
  private async createDemoFromCsv(csvProduct: CsvProduct, vendorId: string): Promise<Demo> {
    const demo = new Demo();
    demo.title = csvProduct.title;
    demo.description = csvProduct.description || '';
    demo.url = csvProduct.demoUrl;
    demo.normalizedUrl = this.csvParserService.normalizeUrl(csvProduct.demoUrl);
    demo.category = csvProduct.category;
    demo.subcategory = csvProduct.subcategory;
    demo.imageUrl = csvProduct.imageUrl;
    demo.status = 'active';
    demo.vendorId = vendorId;
    demo.isAccessible = true;
    demo.viewCount = 0;
    demo.metadata = {
      sku: csvProduct.sku,
      regularPrice: csvProduct.regularPrice,
      salePrice: csvProduct.salePrice,
      source: 'csv_import',
      importedAt: new Date().toISOString()
    };

    return await this.demoRepository.save(demo);
  }

  /**
   * Обновляет существующий демо из CSV товара
   */
  private async updateDemoFromCsv(existingDemo: Demo, csvProduct: CsvProduct): Promise<Demo> {
    existingDemo.title = csvProduct.title;
    existingDemo.description = csvProduct.description || existingDemo.description;
    existingDemo.category = csvProduct.category;
    existingDemo.subcategory = csvProduct.subcategory;
    existingDemo.imageUrl = csvProduct.imageUrl || existingDemo.imageUrl;
    existingDemo.metadata = {
      ...existingDemo.metadata,
      sku: csvProduct.sku,
      regularPrice: csvProduct.regularPrice,
      salePrice: csvProduct.salePrice,
      lastUpdatedAt: new Date().toISOString()
    };

    return await this.demoRepository.save(existingDemo);
  }
}
