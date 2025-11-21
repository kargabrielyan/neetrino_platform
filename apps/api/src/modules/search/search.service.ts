import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { SearchQueryDto, SearchResponseDto, SearchResultDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async search(query: SearchQueryDto): Promise<SearchResponseDto> {
    // Строим условия для поиска
    const where: any = {
      status: 'active',
      isAccessible: true
    };

    // Поиск по тексту
    if (query.q && query.q.trim()) {
      const searchTerm = query.q.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { category: { contains: searchTerm, mode: 'insensitive' } },
        { subcategory: { contains: searchTerm, mode: 'insensitive' } },
        { vendor: { name: { contains: searchTerm, mode: 'insensitive' } } }
      ];
    }

    // Фильтр по вендорам
    if (query.vendors && query.vendors.length > 0) {
      where.vendorId = { in: query.vendors };
    }

    // Фильтр по категориям
    if (query.categories && query.categories.length > 0) {
      where.category = { in: query.categories };
    }

    // Фильтр по подкатегориям
    if (query.subcategories && query.subcategories.length > 0) {
      where.subcategory = { in: query.subcategories };
    }

    // Определяем сортировку
    let orderBy: any = {};
    if (query.sortBy === 'title') {
      orderBy = { title: query.sortOrder?.toLowerCase() || 'asc' };
    } else if (query.sortBy === 'createdAt') {
      orderBy = { createdAt: query.sortOrder?.toLowerCase() || 'desc' };
    } else if (query.sortBy === 'viewCount') {
      orderBy = { viewCount: query.sortOrder?.toLowerCase() || 'desc' };
    } else {
      // По умолчанию по популярности
      orderBy = { viewCount: 'desc' };
    }

    // Пагинация
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    // Получаем общее количество
    const total = await this.prisma.demo.count({ where });

    // Получаем демо с пагинацией
    const demos = await this.prisma.demo.findMany({
      where,
      include: {
        vendor: true
      },
      orderBy,
      skip,
      take: limit
    });

    // Преобразуем в DTO
    const data: SearchResultDto[] = demos.map(demo => ({
      id: demo.id,
      title: demo.title,
      description: demo.description || '',
      url: demo.url,
      category: demo.category || '',
      subcategory: demo.subcategory || '',
      imageUrl: demo.imageUrl || '',
      screenshotUrl: demo.screenshotUrl || demo.imageUrl || '',
      viewCount: demo.viewCount || 0,
      isAccessible: demo.isAccessible,
      vendor: {
        id: demo.vendor.id,
        name: demo.vendor.name,
        website: demo.vendor.website || '',
        logoUrl: demo.vendor.logoUrl || '',
      },
      relevanceScore: this.calculateRelevanceScore(demo, query.q),
      createdAt: demo.createdAt.toISOString(),
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

    try {
      const searchTerm = query.trim();

      // Получаем предложения из названий демо
      const demoSuggestions = await this.prisma.demo.findMany({
        where: {
          title: { contains: searchTerm, mode: 'insensitive' },
          status: 'active'
        },
        select: { title: true },
        distinct: ['title'],
        take: 5
      });

      // Получаем предложения из названий вендоров
      const vendorSuggestions = await this.prisma.vendor.findMany({
        where: {
          name: { contains: searchTerm, mode: 'insensitive' },
          status: 'active'
        },
        select: { name: true },
        distinct: ['name'],
        take: 5
      });

      const suggestions = [
        ...demoSuggestions.map(item => item.title).filter(Boolean),
        ...vendorSuggestions.map(item => item.name).filter(Boolean),
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
      const vendors = await this.prisma.vendor.findMany({
        where: {
          status: 'active',
          demos: {
            some: { status: 'active', isAccessible: true }
          }
        },
        include: {
          _count: {
            select: {
              demos: {
                where: { status: 'active', isAccessible: true }
              }
            }
          }
        }
      });

      // Получаем доступные категории
      const categories = await this.prisma.demo.groupBy({
        by: ['category'],
        where: {
          status: 'active',
          isAccessible: true,
          category: { not: null }
        },
        _count: true
      });

      // Получаем доступные подкатегории
      const subcategories = await this.prisma.demo.groupBy({
        by: ['subcategory'],
        where: {
          status: 'active',
          isAccessible: true,
          subcategory: { not: null }
        },
        _count: true
      });

      return {
        vendors: vendors
          .filter(v => v._count.demos > 0)
          .map(v => ({
            id: v.id,
            name: v.name,
            count: v._count.demos
          })),
        categories: categories
          .filter(c => c.category)
          .map(c => ({
            name: c.category!,
            count: c._count
          })),
        subcategories: subcategories
          .filter(s => s.subcategory)
          .map(s => ({
            name: s.subcategory!,
            count: s._count
          })),
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

  private calculateRelevanceScore(demo: any, query?: string): number {
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
