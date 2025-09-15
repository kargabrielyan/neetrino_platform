import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { Demo } from '../demos/demo.entity';
import { Vendor } from '../vendors/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Demo, Vendor])],
  controllers: [DevController],
  providers: [DevService],
  exports: [DevService],
})
export class DevModule {}
