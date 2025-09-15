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
    if (query.q && query.q.trim()) {
      const searchTerm = `%${query.q.trim()}%`;
      queryBuilder.andWhere(
        '(demo.title ILIKE :search OR demo.description ILIKE :search OR vendor.name ILIKE :search)',
        { search: searchTerm }
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
    if (query.sortBy === 'relevance' && query.q && query.q.trim()) {
      // Для поиска по релевантности
      const searchTerm = `%${query.q.trim()}%`;
      queryBuilder.orderBy('CASE WHEN demo.title ILIKE :exactSearch THEN 1 ELSE 2 END', 'ASC');
      queryBuilder.addOrderBy('demo.viewCount', 'DESC');
      queryBuilder.setParameter('exactSearch', searchTerm);
    } else {
      const sortField = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder || 'DESC';
      
      // Проверяем, что поле сортировки существует
      const allowedSortFields = ['createdAt', 'viewCount', 'title'];
      if (allowedSortFields.includes(sortField)) {
        queryBuilder.orderBy(`demo.${sortField}`, sortOrder);
      } else {
        queryBuilder.orderBy('demo.createdAt', 'DESC');
      }
    }

    // Пагинация
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
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
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = `%${query.trim()}%`;

    try {
      // Получаем предложения из названий демо
      const demoSuggestions = await this.demoRepository
        .createQueryBuilder('demo')
        .select('DISTINCT demo.title')
        .where('demo.title ILIKE :query', { query: searchTerm })
        .andWhere('demo.status = :status', { status: 'active' })
        .limit(5)
        .getRawMany();

      // Получаем предложения из названий вендоров
      const vendorSuggestions = await this.vendorRepository
        .createQueryBuilder('vendor')
        .select('DISTINCT vendor.name')
        .where('vendor.name ILIKE :query', { query: searchTerm })
        .andWhere('vendor.status = :status', { status: 'active' })
        .limit(5)
        .getRawMany();

      const suggestions = [
        ...demoSuggestions.map(item => item.demo_title).filter(Boolean),
        ...vendorSuggestions.map(item => item.vendor_name).filter(Boolean),
      ];

      return [...new Set(suggestions)].slice(0, 10);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  private async getAvailableFilters(query: SearchQueryDto): Promise<{
    vendors: Array<{ id: string; name: string; count: number }>;
    categories: Array<{ name: string; count: number }>;
    subcategories: Array<{ name: string; count: number }>;
  }> {
    try {
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
        .andWhere('demo.category != :empty', { empty: '' })
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
        .andWhere('demo.subcategory != :empty', { empty: '' })
        .groupBy('demo.subcategory')
        .orderBy('demo.subcategory', 'ASC')
        .getRawMany();

      return {
        vendors: vendors.map(v => ({
          id: v.vendor_id,
          name: v.vendor_name,
          count: parseInt(v.count) || 0,
        })).filter(v => v.count > 0),
        categories: categories.map(c => ({
          name: c.demo_category,
          count: parseInt(c.count) || 0,
        })).filter(c => c.count > 0),
        subcategories: subcategories.map(s => ({
          name: s.demo_subcategory,
          count: parseInt(s.count) || 0,
        })).filter(s => s.count > 0),
      };
    } catch (error) {
      console.error('Error getting available filters:', error);
      return {
        vendors: [],
        categories: [],
        subcategories: [],
      };
    }
  }

  private calculateRelevanceScore(demo: Demo, query?: string): number {
    if (!query || !query.trim()) return 0;

    const queryLower = query.toLowerCase().trim();
    let score = 0;

    // Точное совпадение в названии
    if (demo.title && demo.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Совпадение в описании
    if (demo.description && demo.description.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Совпадение в названии вендора
    if (demo.vendor && demo.vendor.name && demo.vendor.name.toLowerCase().includes(queryLower)) {
      score += 3;
    }

    // Популярность (количество просмотров)
    score += Math.min((demo.viewCount || 0) / 100, 5);

    return score;
  }
}