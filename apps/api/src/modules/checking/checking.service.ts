import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class CheckingService {
  constructor(private prisma: PrismaService) {}

  async checkDemoAccessibility(demoId: string) {
    const demo = await this.prisma.safeExecute(async () => {
      return await this.prisma.demo.findUnique({ where: { id: demoId } });
    });
    if (!demo) {
      throw new NotFoundException(`Demo with ID ${demoId} not found`);
    }

    const savedCheckRun = await this.prisma.safeExecute(async () => {
      return await this.prisma.checkRun.create({
        data: {
          demoId,
          startedAt: new Date(),
          status: 'running',
        },
      });
    });

    try {
      // Здесь будет реальная логика проверки доступности URL
      // Пока что используем заглушку
      const isAccessible = await this.performAccessibilityCheck(demo.url);
      
      savedCheckRun.status = 'completed';
      savedCheckRun.finishedAt = new Date();
      savedCheckRun.isAccessible = isAccessible;
      savedCheckRun.responseTime = Math.floor(Math.random() * 1000) + 100;
      savedCheckRun.statusCode = isAccessible ? 200 : 404;

      // Обновляем статус демо
      demo.isAccessible = isAccessible;
      demo.lastCheckedAt = new Date();
      
      if (!isAccessible && demo.status === 'active') {
        demo.status = 'draft';
      } else if (isAccessible && demo.status === 'draft') {
        demo.status = 'active';
      }

      await this.demoRepository.save(demo);
      await this.checkRunRepository.save(savedCheckRun);

    } catch (error) {
      savedCheckRun.status = 'failed';
      savedCheckRun.finishedAt = new Date();
      savedCheckRun.isAccessible = false;
      savedCheckRun.error = error.message;
      await this.checkRunRepository.save(savedCheckRun);
    }

    return savedCheckRun;
  }

  async getCheckRuns(
    page: number = 1,
    limit: number = 20,
    demoId?: string,
  ): Promise<{ data: CheckRun[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.checkRunRepository
      .createQueryBuilder('checkRun')
      .leftJoinAndSelect('checkRun.demo', 'demo')
      .orderBy('checkRun.startedAt', 'DESC');

    if (demoId) {
      queryBuilder.where('checkRun.demoId = :demoId', { demoId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async getCheckRun(id: string): Promise<CheckRun> {
    const checkRun = await this.checkRunRepository.findOne({
      where: { id },
      relations: ['demo'],
    });

    if (!checkRun) {
      throw new NotFoundException(`Check run with ID ${id} not found`);
    }

    return checkRun;
  }

  async runBulkCheck(demoIds: string[]): Promise<{ completed: number; failed: number }> {
    let completed = 0;
    let failed = 0;

    for (const demoId of demoIds) {
      try {
        await this.checkDemoAccessibility(demoId);
        completed++;
      } catch (error) {
        failed++;
        console.error(`Failed to check demo ${demoId}:`, error.message);
      }
    }

    return { completed, failed };
  }

  private async performAccessibilityCheck(url: string): Promise<boolean> {
    // Заглушка для проверки доступности
    // В реальной реализации здесь будет HTTP запрос
    return Math.random() > 0.1; // 90% шанс что URL доступен
  }
}
