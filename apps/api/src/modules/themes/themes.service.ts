import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from '../../entities/theme.entity';

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Theme)
    private themesRepository: Repository<Theme>,
  ) {}

  async findAll(): Promise<Theme[]> {
    return this.themesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
