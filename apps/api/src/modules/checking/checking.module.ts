import { Module } from '@nestjs/common';
import { CheckingController } from './checking.controller';
import { CheckingService } from './checking.service';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CheckingController],
  providers: [CheckingService],
  exports: [CheckingService],
})
export class CheckingModule {}
