import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    // Check if vendor with this name already exists
    const existingVendor = await this.vendorsRepository.findOne({
      where: { name: createVendorDto.name },
    });

    if (existingVendor) {
      throw new ConflictException(`Vendor with name "${createVendorDto.name}" already exists`);
    }

    const vendor = this.vendorsRepository.create(createVendorDto);
    return await this.vendorsRepository.save(vendor);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: string,
  ): Promise<{ data: Vendor[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.vendorsRepository.createQueryBuilder('vendor');

    if (status) {
      queryBuilder.where('vendor.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .orderBy('vendor.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOne({
      where: { id },
      relations: ['demos'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async findByName(name: string): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOne({
      where: { name },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with name "${name}" not found`);
    }

    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    
    // Check if new name conflicts with existing vendor
    if (updateVendorDto.name && updateVendorDto.name !== vendor.name) {
      const existingVendor = await this.vendorsRepository.findOne({
        where: { name: updateVendorDto.name },
      });

      if (existingVendor) {
        throw new ConflictException(`Vendor with name "${updateVendorDto.name}" already exists`);
      }
    }

    Object.assign(vendor, updateVendorDto);
    return await this.vendorsRepository.save(vendor);
  }

  async remove(id: string): Promise<void> {
    const vendor = await this.findOne(id);
    vendor.status = 'inactive';
    await this.vendorsRepository.save(vendor);
  }

  async updateDemoCount(id: string): Promise<void> {
    const vendor = await this.findOne(id);
    const demoCount = await this.vendorsRepository
      .createQueryBuilder('vendor')
      .leftJoin('vendor.demos', 'demo')
      .where('vendor.id = :id', { id })
      .andWhere('demo.status != :deleted', { deleted: 'deleted' })
      .getCount();

    vendor.demoCount = demoCount;
    await this.vendorsRepository.save(vendor);
  }
}
