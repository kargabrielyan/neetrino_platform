# Настройка базы данных для Neetrino Platform

## Требования

- PostgreSQL 12+ 
- Node.js 18+
- npm 9+

## Быстрая настройка

### 1. Установка PostgreSQL

#### Windows:
```bash
# Скачайте и установите PostgreSQL с официального сайта
# https://www.postgresql.org/download/windows/
```

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Создание базы данных

```sql
-- Подключитесь к PostgreSQL как суперпользователь
sudo -u postgres psql

-- Создайте базу данных
CREATE DATABASE neetrino_platform;

-- Создайте пользователя (опционально)
CREATE USER neetrino_user WITH PASSWORD 'your_password';

-- Предоставьте права
GRANT ALL PRIVILEGES ON DATABASE neetrino_platform TO neetrino_user;

-- Выйдите из psql
\q
```

### 3. Настройка переменных окружения

Создайте файл `.env` в папке `apps/api/`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=neetrino_platform

# API Configuration
PORT=3001
NODE_ENV=development

# Feature Flags
PARSING_ENABLED=false
CHECKING_ENABLED=false

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Запуск приложения

```bash
# Из корневой папки проекта
npm install
npm run dev
```

## Структура базы данных

После запуска приложения будут автоматически созданы следующие таблицы:

### vendors
- `id` (UUID) - Primary Key
- `name` (VARCHAR) - Название вендора
- `website` (VARCHAR) - Веб-сайт вендора
- `logo_url` (VARCHAR) - URL логотипа
- `description` (TEXT) - Описание
- `status` (VARCHAR) - Статус (active/inactive/banned)
- `demo_count` (INT) - Количество демо
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### demos
- `id` (UUID) - Primary Key
- `title` (VARCHAR) - Название демо
- `description` (TEXT) - Описание
- `url` (VARCHAR) - URL демо
- `normalized_url` (VARCHAR) - Нормализованный URL
- `status` (VARCHAR) - Статус (active/draft/deleted)
- `category` (VARCHAR) - Категория
- `subcategory` (VARCHAR) - Подкатегория
- `image_url` (VARCHAR) - URL изображения
- `screenshot_url` (VARCHAR) - URL скриншота
- `last_checked_at` (TIMESTAMP) - Последняя проверка
- `is_accessible` (BOOLEAN) - Доступность
- `view_count` (INT) - Количество просмотров
- `vendor_id` (UUID) - Foreign Key к vendors
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### import_runs
- `id` (UUID) - Primary Key
- `vendor_id` (UUID) - Foreign Key к vendors
- `started_at` (TIMESTAMP) - Время начала
- `finished_at` (TIMESTAMP) - Время завершения
- `status` (VARCHAR) - Статус (running/completed/failed)
- `total_found` (INT) - Всего найдено
- `total_new` (INT) - Новых
- `total_ignored` (INT) - Проигнорировано
- `total_errors` (INT) - Ошибок
- `log` (TEXT) - Лог выполнения
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### check_runs
- `id` (UUID) - Primary Key
- `demo_id` (UUID) - Foreign Key к demos
- `started_at` (TIMESTAMP) - Время начала
- `finished_at` (TIMESTAMP) - Время завершения
- `status` (VARCHAR) - Статус (running/completed/failed)
- `is_accessible` (BOOLEAN) - Доступность
- `response_time` (INT) - Время ответа в мс
- `status_code` (INT) - HTTP статус код
- `error` (TEXT) - Ошибка
- `note` (TEXT) - Заметка
- `created_at` (TIMESTAMP)

## Проверка подключения

После запуска API проверьте:

1. **Swagger документация**: http://localhost:3001/api/docs
2. **Health check**: http://localhost:3001/health
3. **API endpoints**: http://localhost:3001/demos, http://localhost:3001/vendors

## Решение проблем

### Ошибка подключения к базе данных
```bash
# Проверьте, что PostgreSQL запущен
sudo systemctl status postgresql

# Проверьте подключение
psql -h localhost -U postgres -d neetrino_platform
```

### Ошибка прав доступа
```sql
-- Предоставьте права пользователю
GRANT ALL PRIVILEGES ON DATABASE neetrino_platform TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
```

### Ошибка порта
```bash
# Проверьте, что порт 3001 свободен
netstat -tulpn | grep 3001

# Или измените порт в .env файле
PORT=3002
```
