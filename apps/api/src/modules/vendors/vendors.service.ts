import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../../entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorsRepository.create(createVendorDto);
    return this.vendorsRepository.save(vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOne({
      where: { id },
      relations: ['demos', 'themes'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    
    Object.assign(vendor, updateVendorDto);
    return this.vendorsRepository.save(vendor);
  }

  async remove(id: string): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorsRepository.remove(vendor);
  }

  async findByBaseUrl(baseUrl: string): Promise<Vendor | null> {
    return this.vendorsRepository.findOne({
      where: { baseUrl },
    });
  }
}
