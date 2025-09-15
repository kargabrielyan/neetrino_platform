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
import { CheckingService } from './checking.service';

@ApiTags('checking')
@Controller('checking')
export class CheckingController {
  constructor(private readonly checkingService: CheckingService) {}

  @Post('demos/:id/check')
  @ApiOperation({ summary: 'Check demo accessibility' })
  @ApiResponse({ status: 200, description: 'Accessibility check completed' })
  @ApiResponse({ status: 404, description: 'Demo not found' })
  checkDemoAccessibility(@Param('id') id: string) {
    return this.checkingService.checkDemoAccessibility(id);
  }

  @Get('runs')
  @ApiOperation({ summary: 'Get check runs history' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'demoId', required: false, type: String, description: 'Filter by demo ID' })
  @ApiResponse({ status: 200, description: 'Check runs retrieved successfully' })
  getCheckRuns(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('demoId') demoId?: string,
  ) {
    return this.checkingService.getCheckRuns(page, limit, demoId);
  }

  @Get('runs/:id')
  @ApiOperation({ summary: 'Get check run details' })
  @ApiResponse({ status: 200, description: 'Check run retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Check run not found' })
  getCheckRun(@Param('id') id: string) {
    return this.checkingService.getCheckRun(id);
  }

  @Post('bulk-check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run bulk accessibility check for multiple demos' })
  @ApiResponse({ status: 200, description: 'Bulk check completed' })
  runBulkCheck(@Body('demoIds') demoIds: string[]) {
    return this.checkingService.runBulkCheck(demoIds);
  }
}
