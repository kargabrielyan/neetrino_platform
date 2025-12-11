import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class DevService {
  constructor(private prisma: PrismaService) {}

  async seedDatabase() {
    try {
      const vendors = [
        { name: 'Shopify', website: 'https://shopify.com', description: 'E-commerce platform', logoUrl: 'https://cdn.shopify.com/shopify-logo.png' },
        { name: 'Webflow', website: 'https://webflow.com', description: 'Visual web design platform', logoUrl: 'https://webflow.com/logo.png' },
        { name: 'WordPress', website: 'https://wordpress.org', description: 'Open source CMS', logoUrl: 'https://wordpress.org/logo.png' },
      ];

      const createdVendors = [];
      for (const vendorData of vendors) {
        let vendor = await this.prisma.safeExecute(async () => {
          return await this.prisma.vendor.findUnique({ where: { name: vendorData.name } });
        });
        if (!vendor) {
          vendor = await this.prisma.safeExecute(async () => {
            return await this.prisma.vendor.create({ data: vendorData });
          });
        }
        if (vendor) createdVendors.push(vendor);
      }

      const demos = [
        { title: 'E-commerce Store', description: 'Modern e-commerce', url: 'https://example-store.com', normalizedUrl: 'https://example-store.com', category: 'E-commerce', subcategory: 'Store', imageUrl: 'https://placeholder.com/400', screenshotUrl: 'https://placeholder.com/800', status: 'active', isAccessible: true, viewCount: 150 },
        { title: 'Portfolio Website', description: 'Creative portfolio', url: 'https://example-portfolio.com', normalizedUrl: 'https://example-portfolio.com', category: 'Portfolio', subcategory: 'Creative', imageUrl: 'https://placeholder.com/400', screenshotUrl: 'https://placeholder.com/800', status: 'active', isAccessible: true, viewCount: 89 },
      ];

      const createdDemos = [];
      for (let i = 0; i < demos.length; i++) {
        const demoData = { ...demos[i], vendorId: createdVendors[i % createdVendors.length]?.id };
        if (!demoData.vendorId) continue;
        
        let demo = await this.prisma.safeExecute(async () => {
          return await this.prisma.demo.findFirst({ where: { normalizedUrl: demoData.normalizedUrl } });
        });
        
        if (!demo) {
          demo = await this.prisma.safeExecute(async () => {
            return await this.prisma.demo.create({ data: demoData });
          });
        }
        if (demo) createdDemos.push(demo);
      }

      return { success: true, message: 'Database seeded', vendors: createdVendors.length, demos: createdDemos.length };
    } catch (error) {
      return { success: false, message: 'Error seeding database', error: error.message };
    }
  }

  async getStatus() {
    try {
      const vendorCount = await this.prisma.safeExecute(async () => await this.prisma.vendor.count()) || 0;
      const demoCount = await this.prisma.safeExecute(async () => await this.prisma.demo.count()) || 0;
      return { database: 'connected', vendors: vendorCount, demos: demoCount, timestamp: new Date().toISOString() };
    } catch (error) {
      return { database: 'error', error: error.message, timestamp: new Date().toISOString() };
    }
  }
}
