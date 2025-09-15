import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from '../../entities/vendor.entity';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового вендора' })
  @ApiResponse({ status: 201, description: 'Вендор создан', type: Vendor })
  async create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех вендоров' })
  @ApiResponse({ status: 200, description: 'Список вендоров', type: [Vendor] })
  async findAll(): Promise<Vendor[]> {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить вендора по ID' })
  @ApiResponse({ status: 200, description: 'Вендор найден', type: Vendor })
  @ApiResponse({ status: 404, description: 'Вендор не найден' })
  async findOne(@Param('id') id: string): Promise<Vendor> {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить вендора' })
  @ApiResponse({ status: 200, description: 'Вендор обновлен', type: Vendor })
  async update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor> {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить вендора' })
  @ApiResponse({ status: 200, description: 'Вендор удален' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.vendorsService.remove(id);
  }
}
