import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { WooCommerceService } from './services/woocommerce.service';
import { CsvParserService, CsvProduct } from './services/csv-parser.service';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    private prisma: PrismaService,
    private readonly wooCommerceService: WooCommerceService,
    private readonly csvParserService: CsvParserService,
  ) {}

  async startImport(vendorId: string): Promise<any> {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    return await this.prisma.importRun.create({
      data: { vendorId, startedAt: new Date(), status: 'running' },
    });
  }

  async getImportRuns(page: number = 1, limit: number = 20): Promise<any> {
    const [data, total] = await Promise.all([
      this.prisma.importRun.findMany({
        include: { vendor: true },
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.importRun.count(),
    ]);

    return { data, total, page, limit };
  }

  async getImportRun(id: string): Promise<any> {
    const importRun = await this.prisma.importRun.findUnique({
      where: { id },
      include: { vendor: true },
    });

    if (!importRun) {
      throw new NotFoundException(`Import run with ID ${id} not found`);
    }

    return importRun;
  }

  async confirmImport(confirmImportDto: any): Promise<{ imported: number; errors: string[] }> {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: confirmImportDto.vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${confirmImportDto.vendorId} not found`);
    }

    let imported = 0;
    const errors: string[] = [];

    for (const url of confirmImportDto.urls) {
      try {
        await this.prisma.demo.create({
          data: {
            title: `Demo from ${vendor.name}`,
            url,
            normalizedUrl: this.normalizeUrl(url),
            vendorId: confirmImportDto.vendorId,
            status: 'active',
          },
        });
        imported++;
      } catch (error) {
        errors.push(`Failed to import ${url}: ${error.message}`);
      }
    }

    await this.updateVendorDemoCount(confirmImportDto.vendorId);

    return { imported, errors };
  }

  async importFromCsv(fileBuffer: Buffer, config: any): Promise<any> {
    this.logger.log(`Starting CSV import for vendor ${config.vendorId}`);

    const vendor = await this.prisma.vendor.findUnique({ where: { id: config.vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${config.vendorId} not found`);
    }

    const csvProducts = await this.csvParserService.parseCsvFile(fileBuffer);
    this.logger.log(`Parsed ${csvProducts.length} products from CSV file`);

    let newProducts = 0;
    let updatedProducts = 0;
    let skippedProducts = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    for (const csvProduct of csvProducts) {
      try {
        if (config.skipInvalid && !csvProduct.demoUrl) {
          skippedProducts++;
          continue;
        }

        const normalizedUrl = this.csvParserService.normalizeUrl(csvProduct.demoUrl);

        const existingDemo = await this.prisma.demo.findFirst({
          where: { normalizedUrl },
        });

        if (existingDemo) {
          if (config.updateExisting) {
            await this.prisma.demo.update({
              where: { id: existingDemo.id },
              data: {
                title: csvProduct.title,
                description: csvProduct.description || existingDemo.description,
                category: csvProduct.category,
                subcategory: csvProduct.subcategory,
                imageUrl: csvProduct.imageUrl || existingDemo.imageUrl,
              },
            });
            updatedProducts++;
          } else {
            skippedProducts++;
          }
        } else {
          await this.prisma.demo.create({
            data: {
              title: csvProduct.title,
              description: csvProduct.description || '',
              url: csvProduct.demoUrl,
              normalizedUrl,
              category: csvProduct.category,
              subcategory: csvProduct.subcategory,
              imageUrl: csvProduct.imageUrl,
              status: 'active',
              vendorId: vendor.id,
              isAccessible: true,
              viewCount: 0,
            },
          });
          newProducts++;
        }
      } catch (error) {
        errors++;
        errorDetails.push(`Error processing "${csvProduct.title}": ${error.message}`);
      }
    }

    return {
      totalProcessed: csvProducts.length,
      newProducts,
      updatedProducts,
      skippedProducts,
      errors,
      message: `Import complete: ${newProducts} new, ${updatedProducts} updated, ${skippedProducts} skipped, ${errors} errors`,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
    };
  }

  private async updateVendorDemoCount(vendorId: string): Promise<void> {
    const count = await this.prisma.demo.count({
      where: { vendorId, status: 'active' },
    });

    await this.prisma.vendor.update({ where: { id: vendorId }, data: { demoCount: count } });
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }

  async getWooCommerceDiff(config: any): Promise<any> {
    return { totalFound: 0, totalNew: 0, totalExisting: 0, totalToUpdate: 0, items: [] };
  }

  async syncWooCommerceProducts(config: any, selectedItems: any[]): Promise<any> {
    return { totalProcessed: 0, imported: 0, updated: 0, errors: 0, errorDetails: [] };
  }

  async testWooCommerceConnection(config: any): Promise<any> {
    return { success: false, message: 'WooCommerce integration not configured' };
  }

  async getWooCommerceCategories(config: any): Promise<any[]> {
    return [];
  }
}
