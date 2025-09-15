import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { ImportRun } from '../../entities/import-run.entity';

@ApiTags('import')
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('csv')
  @ApiOperation({ summary: 'Импорт демо из CSV файла' })
  @ApiResponse({ status: 201, description: 'CSV импорт запущен', type: ImportRun })
  async processCsvImport(
    @Body() body: { vendorId: string; csvData: Array<{ brand: string; url: string; name?: string }> },
  ): Promise<ImportRun> {
    return this.importService.processCsvImport(body.vendorId, body.csvData);
  }

  @Get('diff')
  @ApiOperation({ summary: 'Получить DIFF импорта' })
  async getImportDiff(@Query('vendorId') vendorId: string) {
    return this.importService.getImportDiff(vendorId);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Подтвердить импорт выбранных элементов' })
  async confirmImport(
    @Body() body: { vendorId: string; stagingIds: string[] },
  ) {
    return this.importService.confirmImport(body.vendorId, body.stagingIds);
  }

  @Get('runs')
  @ApiOperation({ summary: 'Получить историю импортов' })
  async getImportRuns(@Query('vendorId') vendorId?: string): Promise<ImportRun[]> {
    return this.importService.getImportRuns(vendorId);
  }
}
