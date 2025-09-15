import { IsString, IsUrl, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ description: 'Vendor name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Vendor website' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Vendor logo URL' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Vendor description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Vendor status', enum: ['active', 'inactive', 'banned'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'banned'])
  status?: 'active' | 'inactive' | 'banned';

  @ApiPropertyOptional({ description: 'Vendor metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
