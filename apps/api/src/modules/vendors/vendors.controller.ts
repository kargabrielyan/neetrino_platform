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
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Vendor already exists' })
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.vendorsService.findAll(page, limit, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get vendor by name' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  findByName(@Param('name') name: string) {
    return this.vendorsService.findByName(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vendor' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 409, description: 'Vendor name already exists' })
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vendor (soft delete)' })
  @ApiResponse({ status: 204, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }

  @Post(':id/update-demo-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update vendor demo count' })
  @ApiResponse({ status: 200, description: 'Demo count updated' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  updateDemoCount(@Param('id') id: string) {
    return this.vendorsService.updateDemoCount(id);
  }
}
