import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { Vendor } from '@prisma/client';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async create(createVendorDto: any): Promise<Vendor> {
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { name: createVendorDto.name },
    });

    if (existingVendor) {
      throw new ConflictException(`Vendor with name "${createVendorDto.name}" already exists`);
    }

    return await this.prisma.vendor.create({ data: createVendorDto });
  }

  async findAll(page: number = 1, limit: number = 20, status?: string): Promise<{ data: Vendor[]; total: number; page: number; limit: number }> {
    const where = status ? { status } : {};
    
    const [data, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.vendor.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: { demos: true },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async findByName(name: string): Promise<Vendor> {
    const vendor = await this.prisma.vendor.findUnique({ where: { name } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with name "${name}" not found`);
    }

    return vendor;
  }

  async update(id: string, updateVendorDto: any): Promise<Vendor> {
    const vendor = await this.findOne(id);

    if (updateVendorDto.name && updateVendorDto.name !== vendor.name) {
      const existingVendor = await this.prisma.vendor.findUnique({
        where: { name: updateVendorDto.name },
      });

      if (existingVendor) {
        throw new ConflictException(`Vendor with name "${updateVendorDto.name}" already exists`);
      }
    }

    return await this.prisma.vendor.update({
      where: { id },
      data: updateVendorDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.vendor.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  async updateDemoCount(id: string): Promise<void> {
    await this.findOne(id);

    const demoCount = await this.prisma.demo.count({
      where: { vendorId: id, status: 'active' },
    });

    await this.prisma.vendor.update({
      where: { id },
      data: { demoCount },
    });
  }
}
