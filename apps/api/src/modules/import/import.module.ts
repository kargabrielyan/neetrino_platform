import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { StagingImport } from '../../entities/staging-import.entity';
import { ImportRun } from '../../entities/import-run.entity';
import { Vendor } from '../../entities/vendor.entity';
import { Demo } from '../../entities/demo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StagingImport, ImportRun, Vendor, Demo])],
  controllers: [ImportController],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
