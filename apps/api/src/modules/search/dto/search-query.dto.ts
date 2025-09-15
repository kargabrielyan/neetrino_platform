import { IsOptional, IsString, IsNumber, Min, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({ required: false, description: 'Search query', example: 'e-commerce' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ required: false, description: 'Filter by vendor IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vendors?: string[];

  @ApiProperty({ required: false, description: 'Filter by categories', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ required: false, description: 'Filter by subcategories', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subcategories?: string[];

  @ApiProperty({ 
    required: false, 
    description: 'Sort by field', 
    enum: ['relevance', 'createdAt', 'viewCount', 'title'],
    default: 'relevance'
  })
  @IsOptional()
  @IsString()
  sortBy?: 'relevance' | 'createdAt' | 'viewCount' | 'title' = 'relevance';

  @ApiProperty({ required: false, description: 'Sort order', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class SearchResultDto {
  @ApiProperty({ description: 'Demo ID' })
  id: string;

  @ApiProperty({ description: 'Demo title' })
  title: string;

  @ApiProperty({ description: 'Demo description' })
  description: string;

  @ApiProperty({ description: 'Demo URL' })
  url: string;

  @ApiProperty({ description: 'Demo category' })
  category: string;

  @ApiProperty({ description: 'Demo subcategory' })
  subcategory: string;

  @ApiProperty({ description: 'Image URL' })
  imageUrl: string;

  @ApiProperty({ description: 'Screenshot URL' })
  screenshotUrl: string;

  @ApiProperty({ description: 'View count' })
  viewCount: number;

  @ApiProperty({ description: 'Is accessible' })
  isAccessible: boolean;

  @ApiProperty({ description: 'Vendor information' })
  vendor: {
    id: string;
    name: string;
    website: string;
    logoUrl: string;
  };

  @ApiProperty({ description: 'Search relevance score' })
  relevanceScore?: number;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;
}

export class SearchResponseDto {
  @ApiProperty({ description: 'Search results', type: [SearchResultDto] })
  data: SearchResultDto[];

  @ApiProperty({ description: 'Total number of results' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Search query used' })
  query: string;

  @ApiProperty({ description: 'Search suggestions', type: [String] })
  suggestions: string[];

  @ApiProperty({ description: 'Available filters' })
  filters: {
    vendors: Array<{ id: string; name: string; count: number }>;
    categories: Array<{ name: string; count: number }>;
    subcategories: Array<{ name: string; count: number }>;
  };
}
