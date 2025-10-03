import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { DemosModule } from './modules/demos/demos.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { SearchModule } from './modules/search/search.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CheckingModule } from './modules/checking/checking.module';
import { ImportModule } from './modules/import/import.module';
import { DevModule } from './modules/dev/dev.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    // Подключаем Prisma глобально
    PrismaModule,
    HealthModule,
    // Подключаем только основные модули (остальные временно отключены)
    DemosModule,
    // VendorsModule,
    // SearchModule,
    // OrdersModule,
    // CheckingModule,
    // ImportModule,
    // DevModule,
    // AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}