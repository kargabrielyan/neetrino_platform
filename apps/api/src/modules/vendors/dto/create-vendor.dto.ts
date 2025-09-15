import { IsString, IsUrl, IsOptional, IsObject, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ description: 'Название вендора' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Базовый URL вендора' })
  @IsUrl()
  baseUrl: string;

  @ApiProperty({ description: 'Активен ли вендор', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Конфигурация коннектора', required: false })
  @IsOptional()
  @IsObject()
  connectorConfig?: {
    type: 'css' | 'api' | 'sitemap';
    params: {
      seedUrls?: string[];
      selectors?: {
        cardSelector?: string;
        linkSelector?: string;
        nameSelector?: string;
      };
      apiEndpoint?: string;
      apiHeaders?: Record<string, string>;
      sitemapUrl?: string;
      urlPattern?: string;
    };
  };

  @ApiProperty({ description: 'Лимиты для вендора', required: false })
  @IsOptional()
  @IsObject()
  limits?: {
    concurrency: number;
    delayMs: number;
    userAgent: string;
  };
}
