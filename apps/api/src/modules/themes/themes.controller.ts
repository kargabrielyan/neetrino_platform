import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThemesService } from './themes.service';
import { Theme } from '../../entities/theme.entity';

@ApiTags('themes')
@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  async findAll(): Promise<Theme[]> {
    return this.themesService.findAll();
  }
}
