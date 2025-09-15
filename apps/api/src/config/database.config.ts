import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Проверяем, доступна ли база данных
const isDatabaseAvailable = process.env.DB_AVAILABLE !== 'false';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'neetrino_platform',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Отключаем автоматическое подключение если база недоступна
  autoLoadEntities: isDatabaseAvailable,
  // Продолжаем работу даже если база недоступна
  retryAttempts: 1,
  retryDelay: 1000,
};