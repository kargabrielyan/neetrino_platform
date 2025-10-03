import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DemoResponseDto {
  @ApiProperty({ 
    description: 'Demo ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiPropertyOptional({ 
    description: 'Demo name',
    example: 'Modern Business Website'
  })
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Demo description',
    example: 'A modern, responsive website template for business use'
  })
  description?: string;

  @ApiProperty({ 
    description: 'Demo URL',
    example: 'https://example.com/demo'
  })
  url: string;

  @ApiProperty({ 
    description: 'Canonical URL (normalized)',
    example: 'https://example.com/demo'
  })
  urlCanonical: string;

  @ApiProperty({ 
    description: 'Demo state',
    example: 'active'
  })
  state: string;

  @ApiPropertyOptional({ 
    description: 'Demo category',
    example: 'business'
  })
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Demo subcategory',
    example: 'corporate'
  })
  subcategory?: string;

  @ApiPropertyOptional({ 
    description: 'Demo preview image URL',
    example: 'https://example.com/images/demo-preview.jpg'
  })
  imageUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Demo screenshot URL',
    example: 'https://example.com/screenshots/demo-full.jpg'
  })
  screenshotUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Additional demo metadata',
    example: { tags: ['modern', 'responsive'], price: 99 }
  })
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'First time demo was seen',
    example: '2024-01-15T10:30:00Z'
  })
  firstSeenAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Last time demo was seen',
    example: '2024-01-15T10:30:00Z'
  })
  lastSeenAt?: Date;

  @ApiPropertyOptional({ 
    description: 'First time demo failed accessibility check',
    example: '2024-01-15T10:30:00Z'
  })
  firstFailedAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Last time demo passed accessibility check',
    example: '2024-01-15T10:30:00Z'
  })
  lastOkAt?: Date;

  @ApiProperty({ 
    description: 'Number of views',
    example: 150
  })
  viewCount: number;

  @ApiProperty({ 
    description: 'Vendor ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  vendorId: string;

  @ApiProperty({ 
    description: 'Vendor information',
    type: 'object',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'TemplateVendor',
      logoUrl: 'https://example.com/logo.png'
    }
  })
  vendor: {
    id: string;
    name: string;
    logoUrl?: string;
  };

  @ApiProperty({ 
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z'
  })
  updatedAt: Date;
}

export class PaginatedDemosResponseDto {
  @ApiProperty({ 
    description: 'Array of demos',
    type: [DemoResponseDto]
  })
  data: DemoResponseDto[];

  @ApiProperty({ 
    description: 'Total number of demos',
    example: 150
  })
  total: number;

  @ApiProperty({ 
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({ 
    description: 'Number of items per page',
    example: 20
  })
  limit: number;
}

export class DemoStatsResponseDto {
  @ApiProperty({ 
    description: 'Total number of demos',
    example: 1000
  })
  total: number;

  @ApiProperty({ 
    description: 'Number of active demos',
    example: 800
  })
  active: number;

  @ApiProperty({ 
    description: 'Number of draft demos',
    example: 150
  })
  draft: number;

  @ApiProperty({ 
    description: 'Number of deleted demos',
    example: 50
  })
  deleted: number;

  @ApiProperty({ 
    description: 'Demos count by vendor',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        vendorName: { type: 'string', example: 'TemplateVendor' },
        count: { type: 'number', example: 100 }
      }
    }
  })
  byVendor: Array<{ vendorName: string; count: number }>;
}

export class BulkOperationResponseDto {
  @ApiProperty({ 
    description: 'Number of successfully updated demos',
    example: 5
  })
  updated: number;

  @ApiProperty({ 
    description: 'Array of error messages',
    example: ['Demo with ID invalid-id not found']
  })
  errors: string[];
}
