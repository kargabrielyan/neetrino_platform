import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { Demo, Prisma } from '@prisma/client';

@Injectable()
export class DemosService {
  constructor(private prisma: PrismaService) {}

  async create(createDemoDto: CreateDemoDto): Promise<Demo> {
    return await this.prisma.safeExecute(async () => {
      return await this.prisma.demo.create({
        data: {
          ...createDemoDto,
          normalizedUrl: this.normalizeUrl(createDemoDto.url),
        },
        include: {
          vendor: true,
        },
      });
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: string,
    category?: string,
    vendorId?: string,
  ): Promise<{ data: Demo[]; total: number; page: number; limit: number }> {
    return await this.prisma.safeExecute(async () => {
      const where: Prisma.DemoWhereInput = {
        status: { not: 'deleted' },
      };

      if (status) {
        where.status = status;
      }

      if (category) {
        where.category = category;
      }

      if (vendorId) {
        where.vendorId = vendorId;
      }

      const [data, total] = await Promise.all([
        this.prisma.demo.findMany({
          where,
          include: {
            vendor: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.demo.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        limit,
      };
    });
  }

  async findOne(idOrSku: string): Promise<Demo> {
    // Логируем, чтобы видеть, что реально прилетает
    console.log('[DemosService.findOne] idOrSku =', idOrSku);
    console.log('[DemosService.findOne] idOrSku type:', typeof idOrSku);
    console.log('[DemosService.findOne] idOrSku length:', idOrSku.length);

    const demo = await this.prisma.safeExecute(async () => {
      // Проверяем, является ли строка UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSku);
      console.log('[DemosService.findOne] isUUID:', isUUID);

      // 1. Если похоже на UUID — пробуем по id
      if (isUUID) {
        const byId = await this.prisma.demo.findUnique({
          where: { id: idOrSku },
          include: {
            vendor: true,
          },
        });
        if (byId) {
          console.log('[DemosService.findOne] ✅ found by id');
          return byId;
        }
        console.log('[DemosService.findOne] ❌ not found by id');
      }

      // 2. Пытаемся найти по sku (именно findFirst, если поле не unique)
      console.log('[DemosService.findOne] 🔍 searching by sku:', idOrSku);
      const bySku = await this.prisma.demo.findFirst({
        where: { sku: idOrSku },
        include: {
          vendor: true,
        },
      });
      if (bySku) {
        console.log('[DemosService.findOne] ✅ found by sku');
        return bySku;
      }
      console.log('[DemosService.findOne] ❌ not found by sku');

      // 3. Пробуем по metadata.sku (если вдруг)
      console.log('[DemosService.findOne] 🔍 searching by metadata.sku:', idOrSku);
      const byMetaSku = await this.prisma.demo.findFirst({
        where: {
          metadata: {
            path: ['sku'],
            equals: idOrSku,
          } as any,
        },
        include: {
          vendor: true,
        },
      });
      if (byMetaSku) {
        console.log('[DemosService.findOne] ✅ found by metadata.sku');
        return byMetaSku;
      }
      console.log('[DemosService.findOne] ❌ not found by metadata.sku');

      return null;
    });

    if (!demo) {
      console.log('[DemosService.findOne] ❌ NOT FOUND - throwing NotFoundException');
      throw new NotFoundException(`Demo with id/sku "${idOrSku}" not found`);
    }

    console.log('[DemosService.findOne] ✅ returning demo:', demo.id, demo.sku, demo.title);
    return demo;
  }

  async update(id: string, updateDemoDto: UpdateDemoDto): Promise<Demo> {
    return await this.prisma.safeExecute(async () => {
      const updateData: Prisma.DemoUpdateInput = {
        ...updateDemoDto,
      };

      if (updateDemoDto.url) {
        updateData.normalizedUrl = this.normalizeUrl(updateDemoDto.url);
      }

      return await this.prisma.demo.update({
        where: { id },
        data: updateData,
        include: {
          vendor: true,
        },
      });
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.safeExecute(async () => {
      await this.prisma.demo.update({
        where: { id },
        data: { status: 'deleted' },
      });
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.prisma.safeExecute(async () => {
      await this.prisma.demo.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    });
  }

  async checkAccessibility(id: string): Promise<{ isAccessible: boolean; lastCheckedAt: Date }> {
    return await this.prisma.safeExecute(async () => {
      // Здесь будет логика проверки доступности URL
      // Пока что заглушка
      const isAccessible = true;
      const lastCheckedAt = new Date();

      await this.prisma.demo.update({
        where: { id },
        data: {
          isAccessible,
          lastCheckedAt,
        },
      });

      return { isAccessible, lastCheckedAt };
    });
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
