import { IsString, IsUrl, IsOptional, IsUUID, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WooCommerceProductDto {
  @ApiProperty({ description: 'WooCommerce product ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product slug' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Short description' })
  @IsString()
  short_description: string;

  @ApiProperty({ description: 'Product URL' })
  @IsUrl()
  permalink: string;

  @ApiProperty({ description: 'Product status' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Product type' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Product price' })
  @IsString()
  price: string;

  @ApiProperty({ description: 'Regular price' })
  @IsString()
  regular_price: string;

  @ApiProperty({ description: 'Sale price' })
  @IsString()
  sale_price: string;

  @ApiProperty({ description: 'Product images', type: [Object] })
  @IsArray()
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;

  @ApiProperty({ description: 'Product categories', type: [Object] })
  @IsArray()
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;

  @ApiProperty({ description: 'Product tags', type: [Object] })
  @IsArray()
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;

  @ApiProperty({ description: 'Product attributes', type: [Object] })
  @IsArray()
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;

  @ApiProperty({ description: 'Product meta data', type: [Object] })
  @IsArray()
  meta_data: Array<{
    id: number;
    key: string;
    value: any;
  }>;

  @ApiProperty({ description: 'Product stock status' })
  @IsString()
  stock_status: string;

  @ApiProperty({ description: 'Product featured' })
  @IsBoolean()
  featured: boolean;

  @ApiProperty({ description: 'Product date created' })
  @IsString()
  date_created: string;

  @ApiProperty({ description: 'Product date modified' })
  @IsString()
  date_modified: string;
}

export class WooCommerceImportConfigDto {
  @ApiProperty({ description: 'WooCommerce store URL' })
  @IsUrl()
  storeUrl: string;

  @ApiProperty({ description: 'WooCommerce consumer key' })
  @IsString()
  consumerKey: string;

  @ApiProperty({ description: 'WooCommerce consumer secret' })
  @IsString()
  consumerSecret: string;

  @ApiProperty({ description: 'Vendor ID to associate products with' })
  @IsUUID()
  vendorId: string;

  @ApiProperty({ description: 'Import only published products', default: true })
  @IsOptional()
  @IsBoolean()
  onlyPublished?: boolean = true;

  @ApiProperty({ description: 'Import only featured products', default: false })
  @IsOptional()
  @IsBoolean()
  onlyFeatured?: boolean = false;

  @ApiProperty({ description: 'Import only products with images', default: true })
  @IsOptional()
  @IsBoolean()
  onlyWithImages?: boolean = true;

  @ApiProperty({ description: 'Category mapping', type: Object })
  @IsOptional()
  categoryMapping?: Record<string, string>;

  @ApiProperty({ description: 'Price range mapping', type: Object })
  @IsOptional()
  priceRangeMapping?: Record<string, string>;
}

export class WooCommerceImportResultDto {
  @ApiProperty({ description: 'Total products found' })
  totalFound: number;

  @ApiProperty({ description: 'New products to import' })
  totalNew: number;

  @ApiProperty({ description: 'Existing products' })
  totalExisting: number;

  @ApiProperty({ description: 'Products to update' })
  totalToUpdate: number;

  @ApiProperty({ description: 'Import items', type: [Object] })
  items: Array<{
    woocommerceId: number;
    name: string;
    url: string;
    price: string;
    category: string;
    imageUrl: string;
    status: 'new' | 'existing' | 'update';
    selected: boolean;
  }>;
}

export class WooCommerceSyncResultDto {
  @ApiProperty({ description: 'Total products processed' })
  totalProcessed: number;

  @ApiProperty({ description: 'Successfully imported' })
  imported: number;

  @ApiProperty({ description: 'Successfully updated' })
  updated: number;

  @ApiProperty({ description: 'Errors occurred' })
  errors: number;

  @ApiProperty({ description: 'Error details', type: [String] })
  errorDetails: string[];
}
