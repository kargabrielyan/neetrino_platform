import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { ImportRun } from './entities/import-run.entity';
import { Demo } from '../demos/demo.entity';
import { Vendor } from '../vendors/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImportRun, Demo, Vendor]),
  ],
  controllers: [ImportController],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
