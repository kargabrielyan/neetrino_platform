import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { ImportDiffDto, ConfirmImportDto } from './dto/import-diff.dto';
import { 
  WooCommerceImportConfigDto, 
  WooCommerceImportResultDto, 
  WooCommerceSyncResultDto 
} from './dto/woocommerce.dto';

@ApiTags('import')
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('runs')
  @ApiOperation({ summary: 'Start import process for vendor' })
  @ApiResponse({ status: 201, description: 'Import process started' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  startImport(@Body('vendorId') vendorId: string) {
    return this.importService.startImport(vendorId);
  }

  @Get('runs')
  @ApiOperation({ summary: 'Get import runs history' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Import runs retrieved successfully' })
  getImportRuns(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.importService.getImportRuns(page, limit);
  }

  @Get('runs/:id')
  @ApiOperation({ summary: 'Get import run details' })
  @ApiResponse({ status: 200, description: 'Import run retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Import run not found' })
  getImportRun(@Param('id') id: string) {
    return this.importService.getImportRun(id);
  }

  @Get('diff')
  @ApiOperation({ summary: 'Get DIFF for vendor import' })
  @ApiQuery({ name: 'vendorId', required: true, type: String, description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'DIFF retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  getDiff(@Query('vendorId') vendorId: string): Promise<ImportDiffDto> {
    return this.importService.getDiff(vendorId);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm import of selected items' })
  @ApiResponse({ status: 200, description: 'Import confirmed successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  confirmImport(@Body() confirmImportDto: ConfirmImportDto) {
    return this.importService.confirmImport(confirmImportDto);
  }

  // WooCommerce Integration Endpoints

  @Post('woocommerce/test-connection')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test WooCommerce connection' })
  @ApiResponse({ status: 200, description: 'Connection test result' })
  @ApiResponse({ status: 400, description: 'Invalid configuration' })
  testWooCommerceConnection(@Body() config: WooCommerceImportConfigDto) {
    return this.importService.testWooCommerceConnection(config);
  }

  @Post('woocommerce/diff')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get WooCommerce products diff' })
  @ApiResponse({ status: 200, description: 'Products diff retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 400, description: 'WooCommerce connection failed' })
  getWooCommerceDiff(@Body() config: WooCommerceImportConfigDto): Promise<WooCommerceImportResultDto> {
    return this.importService.getWooCommerceDiff(config);
  }

  @Post('woocommerce/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync selected WooCommerce products' })
  @ApiResponse({ status: 200, description: 'Products synced successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 400, description: 'Sync failed' })
  syncWooCommerceProducts(
    @Body() body: { 
      config: WooCommerceImportConfigDto; 
      selectedItems: Array<{ woocommerceId: number; status: string }> 
    }
  ): Promise<WooCommerceSyncResultDto> {
    return this.importService.syncWooCommerceProducts(body.config, body.selectedItems);
  }

  @Post('woocommerce/categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get WooCommerce categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Failed to fetch categories' })
  getWooCommerceCategories(@Body() config: WooCommerceImportConfigDto) {
    return this.importService.getWooCommerceCategories(config);
  }

  @Post('push')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Push products from external source' })
  @ApiResponse({ status: 200, description: 'Products pushed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  pushProducts(@Body() body: { items: any[] }) {
    console.log('Received products:', body.items.length);
    return {
      success: true,
      received: body.items.length,
      upsertedByWcId: body.items.length,
      insertedNew: body.items.length,
      message: 'Products received successfully'
    };
  }
}
