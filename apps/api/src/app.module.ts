import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { HealthModule } from './modules/health/health.module';
import { DemosModule } from './modules/demos/demos.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { SearchModule } from './modules/search/search.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CheckingModule } from './modules/checking/checking.module';
import { ImportModule } from './modules/import/import.module';
import { DevModule } from './modules/dev/dev.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    HealthModule,
    DemosModule,
    VendorsModule,
    SearchModule,
    OrdersModule,
    CheckingModule,
    ImportModule,
    DevModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}