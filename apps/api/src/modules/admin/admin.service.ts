import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDemos(query: any) {
    const { page = 1, limit = 20, search, status, category } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { vendor: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.demo.findMany({
        where,
        include: { vendor: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      this.prisma.demo.count({ where }),
    ]);

    return { data, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) };
  }

  async createDemo(demoData: any) {
    return this.prisma.demo.create({ data: demoData });
  }

  async updateDemo(id: string, demoData: any) {
    return this.prisma.demo.update({ where: { id }, data: demoData, include: { vendor: true } });
  }

  async deleteDemo(id: string) {
    return this.prisma.demo.delete({ where: { id } });
  }

  async getOrders(query: any) {
    const { page = 1, limit = 20, search, status } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { demo: { include: { vendor: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) };
  }

  async createOrder(orderData: any) {
    return this.prisma.order.create({ data: orderData });
  }

  async updateOrder(id: string, orderData: any) {
    return this.prisma.order.update({ where: { id }, data: orderData, include: { demo: { include: { vendor: true } } } });
  }

  async deleteOrder(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }

  async getVendors() {
    return this.prisma.vendor.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createVendor(vendorData: any) {
    return this.prisma.vendor.create({ data: vendorData });
  }

  async updateVendor(id: string, vendorData: any) {
    return this.prisma.vendor.update({ where: { id }, data: vendorData });
  }

  async deleteVendor(id: string) {
    return this.prisma.vendor.delete({ where: { id } });
  }

  async getAnalytics() {
    const [totalOrders, totalDemos, totalVendors, recentOrders, avgBudget] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.demo.count(),
      this.prisma.vendor.count(),
      this.prisma.order.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      this.prisma.order.aggregate({ _avg: { budget: true }, where: { budget: { not: null } } }),
    ]);

    return { totalOrders, totalDemos, totalVendors, recentOrders, averageBudget: avgBudget._avg.budget || 0 };
  }

  async getOrderAnalytics() {
    const statusCounts = await this.prisma.order.groupBy({ by: ['status'], _count: true });
    const byStatus = statusCounts.reduce((acc, item) => { acc[item.status] = item._count; return acc; }, {});
    return { byStatus };
  }

  async getDemoAnalytics() {
    const [activeDemos, draftDemos, categoryCounts] = await Promise.all([
      this.prisma.demo.count({ where: { status: 'active' } }),
      this.prisma.demo.count({ where: { status: 'draft' } }),
      this.prisma.demo.groupBy({ by: ['category'], _count: true }),
    ]);

    return { activeDemos, draftDemos, categoryCounts: categoryCounts.map(c => ({ category: c.category, count: c._count })) };
  }

  async getSettings() {
    return {
      siteName: 'Neetrino Platform',
      siteDescription: 'AI-powered demo platform',
      maintenanceMode: false,
      allowRegistration: true,
      maxFileSize: 10485760,
      supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    };
  }

  async updateSettings(settingsData: any) {
    return { message: 'Settings updated successfully', settings: settingsData };
  }
}
