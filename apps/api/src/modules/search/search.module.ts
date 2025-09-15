import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Demo } from '../demos/demo.entity';
import { Vendor } from '../vendors/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Demo, Vendor]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
