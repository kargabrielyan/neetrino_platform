import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Demo } from './demo.entity';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';

@Injectable()
export class DemosService {
  constructor(
    @InjectRepository(Demo)
    private demosRepository: Repository<Demo>,
  ) {}

  async create(createDemoDto: CreateDemoDto): Promise<Demo> {
    const demo = this.demosRepository.create({
      ...createDemoDto,
      normalizedUrl: this.normalizeUrl(createDemoDto.url),
    });
    
    return await this.demosRepository.save(demo);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: string,
    category?: string,
    vendorId?: string,
  ): Promise<{ data: Demo[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.demosRepository
      .createQueryBuilder('demo')
      .leftJoinAndSelect('demo.vendor', 'vendor')
      .where('demo.status != :deleted', { deleted: 'deleted' });

    if (status) {
      queryBuilder.andWhere('demo.status = :status', { status });
    }

    if (category) {
      queryBuilder.andWhere('demo.category = :category', { category });
    }

    if (vendorId) {
      queryBuilder.andWhere('demo.vendorId = :vendorId', { vendorId });
    }

    const [data, total] = await queryBuilder
      .orderBy('demo.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Demo> {
    const demo = await this.demosRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });

    if (!demo) {
      throw new NotFoundException(`Demo with ID ${id} not found`);
    }

    return demo;
  }

  async update(id: string, updateDemoDto: UpdateDemoDto): Promise<Demo> {
    const demo = await this.findOne(id);
    
    Object.assign(demo, updateDemoDto);
    
    if (updateDemoDto.url) {
      demo.normalizedUrl = this.normalizeUrl(updateDemoDto.url);
    }

    return await this.demosRepository.save(demo);
  }

  async remove(id: string): Promise<void> {
    const demo = await this.findOne(id);
    demo.status = 'deleted';
    await this.demosRepository.save(demo);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.demosRepository.increment({ id }, 'viewCount', 1);
  }

  async checkAccessibility(id: string): Promise<{ isAccessible: boolean; lastCheckedAt: Date }> {
    const demo = await this.findOne(id);
    
    // Здесь будет логика проверки доступности URL
    // Пока что заглушка
    const isAccessible = true;
    const lastCheckedAt = new Date();

    demo.isAccessible = isAccessible;
    demo.lastCheckedAt = lastCheckedAt;
    
    await this.demosRepository.save(demo);

    return { isAccessible, lastCheckedAt };
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
