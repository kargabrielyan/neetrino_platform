import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemosService } from './demos.service';
import { DemosController } from './demos.controller';
import { Demo } from './demo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Demo])],
  controllers: [DemosController],
  providers: [DemosService],
  exports: [DemosService],
})
export class DemosModule {}
