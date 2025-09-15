import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Demo } from '../demos/demo.entity';
import { Vendor } from '../vendors/vendor.entity';
import { SearchQueryDto, SearchResponseDto, SearchResultDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Demo)
    private demoRepository: Repository<Demo>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async search(query: SearchQueryDto): Promise<SearchResponseDto> {
    const queryBuilder = this.demoRepository
      .createQueryBuilder('demo')
      .leftJoinAndSelect('demo.vendor', 'vendor')
      .where('demo.status = :status', { status: 'active' })
      .andWhere('demo.isAccessible = :accessible', { accessible: true });

    // Поиск по тексту
    if (query.q) {
      queryBuilder.andWhere(
        '(demo.title ILIKE :search OR demo.description ILIKE :search OR vendor.name ILIKE :search)',
        { search: `%${query.q}%` }
      );
    }

    // Фильтры
    if (query.vendors && query.vendors.length > 0) {
      queryBuilder.andWhere('demo.vendorId IN (:...vendors)', { vendors: query.vendors });
    }

    if (query.categories && query.categories.length > 0) {
      queryBuilder.andWhere('demo.category IN (:...categories)', { categories: query.categories });
    }

    if (query.subcategories && query.subcategories.length > 0) {
      queryBuilder.andWhere('demo.subcategory IN (:...subcategories)', { subcategories: query.subcategories });
    }

    // Сортировка
    if (query.sortBy === 'relevance' && query.q) {
      // Для поиска по релевантности используем простую логику
      queryBuilder.orderBy('CASE WHEN demo.title ILIKE :exactSearch THEN 1 ELSE 2 END', 'ASC');
      queryBuilder.addOrderBy('demo.viewCount', 'DESC');
      queryBuilder.setParameter('exactSearch', `%${query.q}%`);
    } else {
      const sortField = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder || 'DESC';
      queryBuilder.orderBy(`demo.${sortField}`, sortOrder);
    }

    // Пагинация
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [demos, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Преобразуем в DTO
    const data: SearchResultDto[] = demos.map(demo => ({
      id: demo.id,
      title: demo.title,
      description: demo.description,
      url: demo.url,
      category: demo.category,
      subcategory: demo.subcategory,
      imageUrl: demo.imageUrl,
      screenshotUrl: demo.screenshotUrl,
      viewCount: demo.viewCount,
      isAccessible: demo.isAccessible,
      vendor: {
        id: demo.vendor.id,
        name: demo.vendor.name,
        website: demo.vendor.website,
        logoUrl: demo.vendor.logoUrl,
      },
      relevanceScore: this.calculateRelevanceScore(demo, query.q),
      createdAt: demo.createdAt,
    }));

    // Получаем фильтры
    const filters = await this.getAvailableFilters(query);

    // Получаем предложения
    const suggestions = await this.getSearchSuggestions(query.q);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      query: query.q || '',
      suggestions,
      filters,
    };
  }

  async getSearchSuggestions(query?: string): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    // Получаем предложения из названий демо и вендоров
    const demoSuggestions = await this.demoRepository
      .createQueryBuilder('demo')
      .select('DISTINCT demo.title')
      .where('demo.title ILIKE :query', { query: `%${query}%` })
      .andWhere('demo.status = :status', { status: 'active' })
      .limit(5)
      .getRawMany();

    const vendorSuggestions = await this.vendorRepository
      .createQueryBuilder('vendor')
      .select('DISTINCT vendor.name')
      .where('vendor.name ILIKE :query', { query: `%${query}%` })
      .andWhere('vendor.status = :status', { status: 'active' })
      .limit(5)
      .getRawMany();

    const suggestions = [
      ...demoSuggestions.map(item => item.demo_title),
      ...vendorSuggestions.map(item => item.vendor_name),
    ];

    return [...new Set(suggestions)].slice(0, 10);
  }

  private async getAvailableFilters(query: SearchQueryDto): Promise<{
    vendors: Array<{ id: string; name: string; count: number }>;
    categories: Array<{ name: string; count: number }>;
    subcategories: Array<{ name: string; count: number }>;
  }> {
    // Получаем доступных вендоров
    const vendors = await this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoin('vendor.demos', 'demo')
      .select(['vendor.id', 'vendor.name'])
      .addSelect('COUNT(demo.id)', 'count')
      .where('vendor.status = :status', { status: 'active' })
      .andWhere('demo.status = :demoStatus', { demoStatus: 'active' })
      .groupBy('vendor.id, vendor.name')
      .orderBy('vendor.name', 'ASC')
      .getRawMany();

    // Получаем доступные категории
    const categories = await this.demoRepository
      .createQueryBuilder('demo')
      .select('demo.category')
      .addSelect('COUNT(*)', 'count')
      .where('demo.status = :status', { status: 'active' })
      .andWhere('demo.category IS NOT NULL')
      .groupBy('demo.category')
      .orderBy('demo.category', 'ASC')
      .getRawMany();

    // Получаем доступные подкатегории
    const subcategories = await this.demoRepository
      .createQueryBuilder('demo')
      .select('demo.subcategory')
      .addSelect('COUNT(*)', 'count')
      .where('demo.status = :status', { status: 'active' })
      .andWhere('demo.subcategory IS NOT NULL')
      .groupBy('demo.subcategory')
      .orderBy('demo.subcategory', 'ASC')
      .getRawMany();

    return {
      vendors: vendors.map(v => ({
        id: v.vendor_id,
        name: v.vendor_name,
        count: parseInt(v.count) || 0,
      })),
      categories: categories.map(c => ({
        name: c.demo_category,
        count: parseInt(c.count) || 0,
      })),
      subcategories: subcategories.map(s => ({
        name: s.demo_subcategory,
        count: parseInt(s.count) || 0,
      })),
    };
  }

  private calculateRelevanceScore(demo: Demo, query?: string): number {
    if (!query) return 0;

    const queryLower = query.toLowerCase();
    let score = 0;

    // Точное совпадение в названии
    if (demo.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Совпадение в описании
    if (demo.description && demo.description.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Совпадение в названии вендора
    if (demo.vendor.name.toLowerCase().includes(queryLower)) {
      score += 3;
    }

    // Популярность (количество просмотров)
    score += Math.min(demo.viewCount / 100, 5);

    return score;
  }
}
