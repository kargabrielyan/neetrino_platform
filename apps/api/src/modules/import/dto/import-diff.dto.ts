import { IsString, IsUrl, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportDiffItemDto {
  @ApiProperty({ description: 'Vendor name' })
  @IsString()
  vendorName: string;

  @ApiProperty({ description: 'Demo title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Demo URL' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Normalized URL for comparison' })
  @IsString()
  normalizedUrl: string;

  @ApiProperty({ description: 'Whether this item should be imported', default: false })
  @IsOptional()
  selected?: boolean = false;
}

export class ImportDiffDto {
  @ApiProperty({ type: [ImportDiffItemDto], description: 'List of items to import' })
  items: ImportDiffItemDto[];

  @ApiProperty({ description: 'Total items found' })
  totalFound: number;

  @ApiProperty({ description: 'New items to import' })
  totalNew: number;

  @ApiProperty({ description: 'Items already exist' })
  totalExisting: number;
}

export class ConfirmImportDto {
  @ApiProperty({ type: [String], description: 'Array of normalized URLs to import' })
  @IsString({ each: true })
  urls: string[];

  @ApiProperty({ description: 'Vendor ID' })
  @IsUUID()
  vendorId: string;
}
