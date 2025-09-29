import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { WooCommerceService } from './services/woocommerce.service';
import { ImportRun } from './entities/import-run.entity';
import { Demo } from '../demos/demo.entity';
import { Vendor } from '../vendors/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImportRun, Demo, Vendor]),
    HttpModule,
  ],
  controllers: [ImportController],
  providers: [ImportService, WooCommerceService],
  exports: [ImportService, WooCommerceService],
})
export class ImportModule {}
