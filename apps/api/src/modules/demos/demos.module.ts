import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemosController } from './demos.controller';
import { DemosService } from './demos.service';
import { Demo } from '../../entities/demo.entity';
import { Vendor } from '../../entities/vendor.entity';
import { Theme } from '../../entities/theme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Demo, Vendor, Theme])],
  controllers: [DemosController],
  providers: [DemosService],
  exports: [DemosService],
})
export class DemosModule {}
