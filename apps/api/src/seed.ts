import { DataSource } from 'typeorm';
import { Demo } from './modules/demos/demo.entity';
import { Vendor } from './modules/vendors/vendor.entity';
import { Order } from './modules/orders/order.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'neetrino_platform',
  entities: [Demo, Vendor, Order],
  synchronize: true,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const vendorRepository = AppDataSource.getRepository(Vendor);
    const demoRepository = AppDataSource.getRepository(Demo);

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
      let vendor = await vendorRepository.findOne({ where: { name: vendorData.name } });
      if (!vendor) {
        vendor = vendorRepository.create(vendorData);
        vendor = await vendorRepository.save(vendor);
        console.log(`Created vendor: ${vendor.name}`);
      }
      createdVendors.push(vendor);
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

    for (const demoData of demos) {
      let demo = await demoRepository.findOne({ where: { normalizedUrl: demoData.normalizedUrl } });
      if (!demo) {
        demo = demoRepository.create(demoData);
        demo = await demoRepository.save(demo);
        console.log(`Created demo: ${demo.title}`);
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
