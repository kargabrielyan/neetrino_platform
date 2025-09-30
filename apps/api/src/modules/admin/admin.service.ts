import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Demo } from '../demos/demo.entity';
import { Order } from '../orders/order.entity';
import { Vendor } from '../vendors/vendor.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Demo)
    private demoRepository: Repository<Demo>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  // Demos Management
  async getDemos(query: any) {
    const { page = 1, limit = 20, search, status, category } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.demoRepository
      .createQueryBuilder('demo')
      .leftJoinAndSelect('demo.vendor', 'vendor')
      .skip(skip)
      .take(limit)
      .orderBy('demo.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        '(demo.title ILIKE :search OR demo.description ILIKE :search OR vendor.name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('demo.status = :status', { status });
    }

    if (category) {
      queryBuilder.andWhere('demo.category = :category', { category });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async createDemo(demoData: any) {
    const demo = this.demoRepository.create(demoData);
    return this.demoRepository.save(demo);
  }

  async updateDemo(id: string, demoData: any) {
    await this.demoRepository.update(id, demoData);
    return this.demoRepository.findOne({ where: { id }, relations: ['vendor'] });
  }

  async deleteDemo(id: string) {
    return this.demoRepository.delete(id);
  }

  // Orders Management
  async getOrders(query: any) {
    const { page = 1, limit = 20, search, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.demo', 'demo')
      .leftJoinAndSelect('demo.vendor', 'vendor')
      .skip(skip)
      .take(limit)
      .orderBy('order.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        '(order.customerName ILIKE :search OR order.customerEmail ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async createOrder(orderData: any) {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async updateOrder(id: string, orderData: any) {
    await this.orderRepository.update(id, orderData);
    return this.orderRepository.findOne({ 
      where: { id }, 
      relations: ['demo', 'demo.vendor'] 
    });
  }

  async deleteOrder(id: string) {
    return this.orderRepository.delete(id);
  }

  // Vendors Management
  async getVendors() {
    return this.vendorRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async createVendor(vendorData: any) {
    const vendor = this.vendorRepository.create(vendorData);
    return this.vendorRepository.save(vendor);
  }

  async updateVendor(id: string, vendorData: any) {
    await this.vendorRepository.update(id, vendorData);
    return this.vendorRepository.findOne({ where: { id } });
  }

  async deleteVendor(id: string) {
    return this.vendorRepository.delete(id);
  }

  // Analytics
  async getAnalytics() {
    const [totalOrders, totalDemos, totalVendors] = await Promise.all([
      this.orderRepository.count(),
      this.demoRepository.count(),
      this.vendorRepository.count(),
    ]);

    const recentOrders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.createdAt >= :date', { 
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
      })
      .getCount();

    const averageBudget = await this.orderRepository
      .createQueryBuilder('order')
      .select('AVG(order.budget)', 'avg')
      .where('order.budget IS NOT NULL')
      .getRawOne();

    return {
      totalOrders,
      totalDemos,
      totalVendors,
      recentOrders,
      averageBudget: averageBudget?.avg || 0,
    };
  }

  async getOrderAnalytics() {
    const statusCounts = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const byStatus = statusCounts.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});

    return { byStatus };
  }

  async getDemoAnalytics() {
    const [activeDemos, draftDemos] = await Promise.all([
      this.demoRepository.count({ where: { status: 'active' } }),
      this.demoRepository.count({ where: { status: 'draft' } }),
    ]);

    const categoryCounts = await this.demoRepository
      .createQueryBuilder('demo')
      .select('demo.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('demo.category')
      .getRawMany();

    return {
      activeDemos,
      draftDemos,
      categoryCounts,
    };
  }

  // Settings
  async getSettings() {
    // This would typically come from a settings table or config
    return {
      siteName: 'Neetrino Platform',
      siteDescription: 'AI-powered demo platform',
      maintenanceMode: false,
      allowRegistration: true,
      maxFileSize: 10485760, // 10MB
      supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    };
  }

  async updateSettings(settingsData: any) {
    // This would typically update a settings table
    return { message: 'Settings updated successfully', settings: settingsData };
  }
}
