import { IsString, IsUrl, IsOptional, IsEnum, IsUUID, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDemoDto {
  @ApiProperty({ description: 'Demo title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Demo description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Demo URL' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({ description: 'Demo category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Demo subcategory' })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiPropertyOptional({ description: 'Demo image URL' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Demo screenshot URL' })
  @IsOptional()
  @IsUrl()
  screenshotUrl?: string;

  @ApiPropertyOptional({ description: 'Demo metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Vendor ID' })
  @IsUUID()
  vendorId: string;
}
