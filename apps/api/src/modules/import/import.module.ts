import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MulterModule } from '@nestjs/platform-express';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { WooCommerceService } from './services/woocommerce.service';
import { CsvParserService } from './services/csv-parser.service';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    MulterModule.register({
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  ],
  controllers: [ImportController],
  providers: [ImportService, WooCommerceService, CsvParserService],
  exports: [ImportService, WooCommerceService, CsvParserService],
})
export class ImportModule {}
