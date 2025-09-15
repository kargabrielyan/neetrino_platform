import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckingController } from './checking.controller';
import { CheckingService } from './checking.service';
import { CheckRun } from './entities/check-run.entity';
import { Demo } from '../demos/demo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckRun, Demo]),
  ],
  controllers: [CheckingController],
  providers: [CheckingService],
  exports: [CheckingService],
})
export class CheckingModule {}
