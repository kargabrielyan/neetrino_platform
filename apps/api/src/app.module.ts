import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { DemosModule } from './modules/demos/demos.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { ImportModule } from './modules/import/import.module';
import { CheckingModule } from './modules/checking/checking.module';
import { databaseConfig } from './config/database.config';

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
    ImportModule,
    CheckingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
