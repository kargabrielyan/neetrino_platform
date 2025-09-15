import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { VendorsModule } from './modules/vendors/vendors.module';
import { ThemesModule } from './modules/themes/themes.module';
import { DemosModule } from './modules/demos/demos.module';
import { ImportModule } from './modules/import/import.module';
import { MediaModule } from './modules/media/media.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// Config
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),

    // Redis & Bull
    BullModule.forRootAsync({
      useFactory: redisConfig,
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
    VendorsModule,
    ThemesModule,
    DemosModule,
    ImportModule,
    MediaModule,
  ],
})
export class AppModule {}
