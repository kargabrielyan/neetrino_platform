import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DemosService } from './demos.service';
import { Demo } from '../../entities/demo.entity';

@ApiTags('demos')
@Controller('demos')
export class DemosController {
  constructor(private readonly demosService: DemosService) {}

  @Get()
  async findAll(): Promise<Demo[]> {
    return this.demosService.findAll();
  }
}
