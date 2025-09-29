import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WooCommerceProductDto, WooCommerceImportConfigDto } from '../dto/woocommerce.dto';

@Injectable()
export class WooCommerceService {
  private readonly logger = new Logger(WooCommerceService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Получает все продукты из WooCommerce магазина
   */
  async getAllProducts(config: WooCommerceImportConfigDto): Promise<WooCommerceProductDto[]> {
    try {
      const allProducts: WooCommerceProductDto[] = [];
      let page = 1;
      const perPage = 100; // Максимум для WooCommerce API
      let hasMore = true;

      while (hasMore) {
        this.logger.log(`Fetching products page ${page}...`);
        
        const products = await this.getProductsPage(config, page, perPage);
        
        if (products.length === 0) {
          hasMore = false;
        } else {
          allProducts.push(...products);
          page++;
          
          // Если получили меньше чем perPage, значит это последняя страница
          if (products.length < perPage) {
            hasMore = false;
          }
        }
      }

      this.logger.log(`Total products fetched: ${allProducts.length}`);
      return allProducts;
    } catch (error) {
      this.logger.error('Error fetching products from WooCommerce:', error);
      throw new BadRequestException('Failed to fetch products from WooCommerce');
    }
  }

  /**
   * Получает одну страницу продуктов
   */
  private async getProductsPage(
    config: WooCommerceImportConfigDto,
    page: number,
    perPage: number
  ): Promise<WooCommerceProductDto[]> {
    const url = `${config.storeUrl}/wp-json/wc/v3/products`;
    
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      status: config.onlyPublished ? 'publish' : 'any',
      featured: config.onlyFeatured ? 'true' : 'any',
    });

    const response = await firstValueFrom(
      this.httpService.get(`${url}?${params}`, {
        auth: {
          username: config.consumerKey,
          password: config.consumerSecret,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    return response.data;
  }

  /**
   * Получает конкретный продукт по ID
   */
  async getProductById(
    config: WooCommerceImportConfigDto,
    productId: number
  ): Promise<WooCommerceProductDto> {
    try {
      const url = `${config.storeUrl}/wp-json/wc/v3/products/${productId}`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          auth: {
            username: config.consumerKey,
            password: config.consumerSecret,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching product ${productId}:`, error);
      throw new BadRequestException(`Failed to fetch product ${productId}`);
    }
  }

  /**
   * Проверяет подключение к WooCommerce API
   */
  async testConnection(config: WooCommerceImportConfigDto): Promise<boolean> {
    try {
      const url = `${config.storeUrl}/wp-json/wc/v3/system_status`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          auth: {
            username: config.consumerKey,
            password: config.consumerSecret,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      return response.status === 200;
    } catch (error) {
      this.logger.error('WooCommerce connection test failed:', error);
      return false;
    }
  }

  /**
   * Получает категории продуктов
   */
  async getCategories(config: WooCommerceImportConfigDto): Promise<any[]> {
    try {
      const url = `${config.storeUrl}/wp-json/wc/v3/products/categories`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          auth: {
            username: config.consumerKey,
            password: config.consumerSecret,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching categories:', error);
      throw new BadRequestException('Failed to fetch categories');
    }
  }

  /**
   * Фильтрует продукты согласно настройкам импорта
   */
  filterProducts(products: WooCommerceProductDto[], config: WooCommerceImportConfigDto): WooCommerceProductDto[] {
    return products.filter(product => {
      // Фильтр по статусу
      if (config.onlyPublished && product.status !== 'publish') {
        return false;
      }

      // Фильтр по featured
      if (config.onlyFeatured && !product.featured) {
        return false;
      }

      // Фильтр по наличию изображений
      if (config.onlyWithImages && (!product.images || product.images.length === 0)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Преобразует WooCommerce продукт в формат для импорта
   */
  transformProductToImportItem(
    product: WooCommerceProductDto,
    config: WooCommerceImportConfigDto
  ): {
    woocommerceId: number;
    name: string;
    url: string;
    price: string;
    category: string;
    imageUrl: string;
    status: 'new' | 'existing' | 'update';
    selected: boolean;
  } {
    // Определяем категорию
    const category = product.categories && product.categories.length > 0 
      ? product.categories[0].name 
      : 'Uncategorized';

    // Определяем цену
    const price = product.sale_price && parseFloat(product.sale_price) > 0 
      ? product.sale_price 
      : product.regular_price;

    // Получаем URL изображения
    const imageUrl = product.images && product.images.length > 0 
      ? product.images[0].src 
      : '';

    return {
      woocommerceId: product.id,
      name: product.name,
      url: product.permalink,
      price,
      category,
      imageUrl,
      status: 'new', // Будет определено при сравнении с существующими
      selected: false,
    };
  }
}
