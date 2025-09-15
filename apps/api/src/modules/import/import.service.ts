import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportRun } from './entities/import-run.entity';
import { Demo } from '../demos/demo.entity';
import { Vendor } from '../vendors/vendor.entity';
import { ImportDiffDto, ImportDiffItemDto, ConfirmImportDto } from './dto/import-diff.dto';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(ImportRun)
    private importRunRepository: Repository<ImportRun>,
    @InjectRepository(Demo)
    private demoRepository: Repository<Demo>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
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

  async getDiff(vendorId: string): Promise<ImportDiffDto> {
    const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    // Здесь будет логика получения данных из внешнего источника
    // Пока что возвращаем моковые данные
    const mockUrls = [
      'https://example1.com/demo1',
      'https://example2.com/demo2',
      'https://example3.com/demo3',
    ];

    const items: ImportDiffItemDto[] = [];
    let totalNew = 0;

    for (const url of mockUrls) {
      const normalizedUrl = this.normalizeUrl(url);
      
      // Проверяем, существует ли уже такой демо
      const existingDemo = await this.demoRepository.findOne({
        where: { normalizedUrl },
      });

      if (!existingDemo) {
        totalNew++;
        items.push({
          vendorName: vendor.name,
          title: `Demo from ${vendor.name}`,
          url,
          normalizedUrl,
          selected: false,
        });
      }
    }

    return {
      items,
      totalFound: mockUrls.length,
      totalNew,
      totalExisting: mockUrls.length - totalNew,
    };
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
}
