import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CsvImportResultDto {
  @ApiProperty({ description: 'Общее количество обработанных товаров' })
  totalProcessed: number;

  @ApiProperty({ description: 'Количество новых товаров' })
  newProducts: number;

  @ApiProperty({ description: 'Количество обновленных товаров' })
  updatedProducts: number;

  @ApiProperty({ description: 'Количество пропущенных товаров' })
  skippedProducts: number;

  @ApiProperty({ description: 'Количество ошибок' })
  errors: number;

  @ApiProperty({ description: 'Сообщение о результате' })
  message: string;

  @ApiPropertyOptional({ description: 'Детали ошибок' })
  errorDetails?: string[];
}

export class CsvImportConfigDto {
  @ApiProperty({ description: 'ID вендора для импорта' })
  @IsString()
  vendorId: string;

  @ApiPropertyOptional({ description: 'Обновлять существующие товары' })
  @IsOptional()
  updateExisting?: boolean = true;

  @ApiPropertyOptional({ description: 'Пропускать товары без URL' })
  @IsOptional()
  skipInvalid?: boolean = true;
}
