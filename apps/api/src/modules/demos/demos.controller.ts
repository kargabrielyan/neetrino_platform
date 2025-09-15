import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DemosService } from './demos.service';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';

@ApiTags('demos')
@Controller('demos')
export class DemosController {
  constructor(private readonly demosService: DemosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new demo' })
  @ApiResponse({ status: 201, description: 'Demo created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createDemoDto: CreateDemoDto) {
    return this.demosService.create(createDemoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all demos with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'vendorId', required: false, type: String, description: 'Filter by vendor ID' })
  @ApiResponse({ status: 200, description: 'Demos retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('vendorId') vendorId?: string,
  ) {
    return this.demosService.findAll(page, limit, status, category, vendorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get demo by ID' })
  @ApiResponse({ status: 200, description: 'Demo retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Demo not found' })
  findOne(@Param('id') id: string) {
    return this.demosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update demo' })
  @ApiResponse({ status: 200, description: 'Demo updated successfully' })
  @ApiResponse({ status: 404, description: 'Demo not found' })
  update(@Param('id') id: string, @Body() updateDemoDto: UpdateDemoDto) {
    return this.demosService.update(id, updateDemoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete demo (soft delete)' })
  @ApiResponse({ status: 204, description: 'Demo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Demo not found' })
  remove(@Param('id') id: string) {
    return this.demosService.remove(id);
  }

  @Post(':id/view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment demo view count' })
  @ApiResponse({ status: 200, description: 'View count incremented' })
  @ApiResponse({ status: 404, description: 'Demo not found' })
  incrementViewCount(@Param('id') id: string) {
    return this.demosService.incrementViewCount(id);
  }

  @Post(':id/check-accessibility')
  @ApiOperation({ summary: 'Check demo accessibility' })
  @ApiResponse({ status: 200, description: 'Accessibility checked' })
  @ApiResponse({ status: 404, description: 'Demo not found' })
  checkAccessibility(@Param('id') id: string) {
    return this.demosService.checkAccessibility(id);
  }
}
