import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StagingImport } from '../../entities/staging-import.entity';
import { ImportRun } from '../../entities/import-run.entity';
import { Vendor } from '../../entities/vendor.entity';
import { Demo } from '../../entities/demo.entity';
import { normalizeUrl } from '../../utils/url.utils';

export interface ImportDiffItem {
  id: string;
  brand: string;
  name?: string;
  url: string;
  urlCanonical: string;
  isNew: boolean;
}

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(StagingImport)
    private stagingImportRepository: Repository<StagingImport>,
    @InjectRepository(ImportRun)
    private importRunRepository: Repository<ImportRun>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Demo)
    private demoRepository: Repository<Demo>,
  ) {}

  async processCsvImport(
    vendorId: string,
    csvData: Array<{ brand: string; url: string; name?: string }>,
  ): Promise<ImportRun> {
    const vendor = await this.vendorRepository.findOne({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    // Создаем запись о запуске импорта
    const importRun = this.importRunRepository.create({
      vendorId,
      startedAt: new Date(),
      source: 'csv',
    });
    await this.importRunRepository.save(importRun);

    let found = 0;
    let newItems = 0;
    let ignored = 0;
    let errors = 0;

    try {
      for (const item of csvData) {
        found++;
        
        try {
          const urlCanonical = normalizeUrl(item.url);
          
          // Проверяем, есть ли уже такой URL в staging_imports
          const existingStaging = await this.stagingImportRepository.findOne({
            where: { vendorId, urlCanonical },
          });

          if (existingStaging) {
            ignored++;
            continue;
          }

          // Создаем запись в staging_imports
          const stagingImport = this.stagingImportRepository.create({
            vendorId,
            brand: item.brand,
            name: item.name,
            url: item.url,
            urlCanonical,
            source: 'csv',
          });

          await this.stagingImportRepository.save(stagingImport);
          newItems++;
        } catch (error) {
          errors++;
          console.error(`Error processing item: ${item.url}`, error);
        }
      }

      // Обновляем статистику импорта
      importRun.totals = { found, new: newItems, ignored, errors };
      importRun.finishedAt = new Date();
      await this.importRunRepository.save(importRun);

      return importRun;
    } catch (error) {
      importRun.totals = { found, new: newItems, ignored, errors };
      importRun.finishedAt = new Date();
      importRun.log = error.message;
      await this.importRunRepository.save(importRun);
      throw error;
    }
  }

  async getImportDiff(vendorId: string): Promise<ImportDiffItem[]> {
    const stagingImports = await this.stagingImportRepository.find({
      where: { vendorId },
      order: { importedAt: 'DESC' },
    });

    const diffItems: ImportDiffItem[] = [];

    for (const staging of stagingImports) {
      // Проверяем, есть ли уже такой демо
      const existingDemo = await this.demoRepository.findOne({
        where: { vendorId, urlCanonical: staging.urlCanonical },
      });

      diffItems.push({
        id: staging.id,
        brand: staging.brand,
        name: staging.name,
        url: staging.url,
        urlCanonical: staging.urlCanonical,
        isNew: !existingDemo,
      });
    }

    return diffItems;
  }

  async confirmImport(vendorId: string, stagingIds: string[]): Promise<Demo[]> {
    const stagingImports = await this.stagingImportRepository.find({
      where: { id: stagingIds, vendorId },
    });

    const createdDemos: Demo[] = [];

    for (const staging of stagingImports) {
      // Проверяем, что демо еще не существует
      const existingDemo = await this.demoRepository.findOne({
        where: { vendorId, urlCanonical: staging.urlCanonical },
      });

      if (existingDemo) {
        continue;
      }

      // Создаем демо
      const demo = this.demoRepository.create({
        vendorId,
        name: staging.name,
        url: staging.url,
        urlCanonical: staging.urlCanonical,
        state: 'active',
        firstSeenAt: new Date(),
        lastSeenAt: new Date(),
      });

      const savedDemo = await this.demoRepository.save(demo);
      createdDemos.push(savedDemo);

      // Удаляем из staging
      await this.stagingImportRepository.remove(staging);
    }

    return createdDemos;
  }

  async getImportRuns(vendorId?: string): Promise<ImportRun[]> {
    const where = vendorId ? { vendorId } : {};
    
    return this.importRunRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['vendor'],
    });
  }
}
