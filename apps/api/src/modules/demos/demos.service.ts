import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Demo } from '../../entities/demo.entity';

@Injectable()
export class DemosService {
  constructor(
    @InjectRepository(Demo)
    private demosRepository: Repository<Demo>,
  ) {}

  async findAll(): Promise<Demo[]> {
    return this.demosRepository.find({
      relations: ['vendor', 'theme', 'mediaSet'],
      order: { createdAt: 'DESC' },
    });
  }
}
