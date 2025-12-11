import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CheckRun } from '@prisma/client';

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

    const checkRun = await this.prisma.safeExecute(async () => {
      return await this.prisma.checkRun.create({
        data: { demoId, startedAt: new Date(), status: 'running' },
      });
    });

    if (!checkRun) throw new Error('Failed to create check run');

    try {
      const isAccessible = await this.performAccessibilityCheck(demo.url);
      const responseTime = Math.floor(Math.random() * 1000) + 100;
      const statusCode = isAccessible ? 200 : 404;

      const updatedCheckRun = await this.prisma.safeExecute(async () => {
        return await this.prisma.checkRun.update({
          where: { id: checkRun.id },
          data: { status: 'completed', finishedAt: new Date(), isAccessible, responseTime, statusCode },
        });
      });

      let newStatus = demo.status;
      if (!isAccessible && demo.status === 'active') newStatus = 'draft';
      else if (isAccessible && demo.status === 'draft') newStatus = 'active';

      await this.prisma.safeExecute(async () => {
        return await this.prisma.demo.update({
          where: { id: demoId },
          data: { isAccessible, lastCheckedAt: new Date(), status: newStatus },
        });
      });

      return updatedCheckRun;
    } catch (error) {
      const failedCheckRun = await this.prisma.safeExecute(async () => {
        return await this.prisma.checkRun.update({
          where: { id: checkRun.id },
          data: { status: 'failed', finishedAt: new Date(), isAccessible: false, error: error.message },
        });
      });
      return failedCheckRun;
    }
  }

  async getCheckRuns(page: number = 1, limit: number = 20, demoId?: string): Promise<{ data: CheckRun[]; total: number; page: number; limit: number }> {
    const where = demoId ? { demoId } : {};
    const [data, total] = await Promise.all([
      this.prisma.checkRun.findMany({ where, include: { demo: true }, orderBy: { startedAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.checkRun.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async getCheckRun(id: string): Promise<CheckRun> {
    const checkRun = await this.prisma.checkRun.findUnique({ where: { id }, include: { demo: true } });
    if (!checkRun) throw new NotFoundException(`Check run with ID ${id} not found`);
    return checkRun;
  }

  async runBulkCheck(demoIds: string[]): Promise<{ completed: number; failed: number }> {
    let completed = 0, failed = 0;
    for (const demoId of demoIds) {
      try { await this.checkDemoAccessibility(demoId); completed++; }
      catch { failed++; }
    }
    return { completed, failed };
  }

  private async performAccessibilityCheck(url: string): Promise<boolean> {
    return Math.random() > 0.1;
  }
}
