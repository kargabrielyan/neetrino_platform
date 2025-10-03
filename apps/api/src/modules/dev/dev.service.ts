import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class DevService {
  constructor(private prisma: PrismaService) {}

  async seedDatabase() {
    try {
      // Создаем тестовых вендоров
      const vendors = [
        {
          name: 'Shopify',
          website: 'https://shopify.com',
          description: 'E-commerce platform for online stores',
          logoUrl: 'https://cdn.shopify.com/s/files/1/0070/7032/files/shopify-logo.png',
        },
        {
          name: 'Webflow',
          website: 'https://webflow.com',
          description: 'Visual web design platform',
          logoUrl: 'https://uploads-ssl.webflow.com/5d3e265ac8bcb6bc2f86b3c6/5d5595354c65721b5a0b8e0c_webflow-logo.png',
        },
        {
          name: 'WordPress',
          website: 'https://wordpress.org',
          description: 'Open source content management system',
          logoUrl: 'https://s.w.org/images/wmark.png',
        },
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

      // Создаем тестовые демо
      const demos = [
        {
          title: 'E-commerce Store',
          description: 'Modern e-commerce platform with advanced features',
          url: 'https://example-store.com',
          normalizedUrl: 'https://example-store.com',
          category: 'E-commerce',
          subcategory: 'Online Store',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          vendorId: createdVendors[0].id,
          status: 'active' as const,
          isAccessible: true,
          viewCount: 150,
        },
        {
          title: 'Portfolio Website',
          description: 'Creative portfolio website with modern design',
          url: 'https://example-portfolio.com',
          normalizedUrl: 'https://example-portfolio.com',
          category: 'Portfolio',
          subcategory: 'Creative',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          vendorId: createdVendors[1].id,
          status: 'active' as const,
          isAccessible: true,
          viewCount: 89,
        },
        {
          title: 'Blog Platform',
          description: 'Content management system for bloggers',
          url: 'https://example-blog.com',
          normalizedUrl: 'https://example-blog.com',
          category: 'Blog',
          subcategory: 'CMS',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          vendorId: createdVendors[2].id,
          status: 'active' as const,
          isAccessible: true,
          viewCount: 234,
        },
        {
          title: 'Corporate Website',
          description: 'Professional corporate website with modern design',
          url: 'https://example-corporate.com',
          normalizedUrl: 'https://example-corporate.com',
          category: 'Corporate',
          subcategory: 'Business',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          vendorId: createdVendors[0].id,
          status: 'active' as const,
          isAccessible: true,
          viewCount: 67,
        },
        {
          title: 'SaaS Dashboard',
          description: 'Software as a Service dashboard with analytics',
          url: 'https://example-saas.com',
          normalizedUrl: 'https://example-saas.com',
          category: 'SaaS',
          subcategory: 'Dashboard',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          vendorId: createdVendors[1].id,
          status: 'active' as const,
          isAccessible: true,
          viewCount: 312,
        },
      ];

      const createdDemos = [];
      for (const demoData of demos) {
        let demo = await this.prisma.safeExecute(async () => {
          return await this.prisma.demo.findUnique({ where: { normalizedUrl: demoData.normalizedUrl } });
        });
        if (!demo) {
          demo = await this.prisma.safeExecute(async () => {
            return await this.prisma.demo.create({ data: demoData });
          });
        }
        if (demo) createdDemos.push(demo);
      }

      return {
        success: true,
        message: 'Database seeded successfully',
        vendors: createdVendors.length,
        demos: createdDemos.length,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error seeding database',
        error: error.message,
      };
    }
  }

  async getStatus() {
    try {
      const vendorCount = await this.vendorRepository.count();
      const demoCount = await this.demoRepository.count();
      
      return {
        database: 'connected',
        vendors: vendorCount,
        demos: demoCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        database: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
