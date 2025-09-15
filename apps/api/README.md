# Neetrino Platform API

NestJS API для платформы поиска и просмотра демо-сайтов.

## Установка и запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка базы данных
Создайте файл `.env` в корне папки `apps/api/`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=neetrino_platform

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Feature Flags
PARSING_ENABLED=false
CHECKING_ENABLED=false
```

### 3. Запуск PostgreSQL
```bash
# Через Docker
docker run --name neetrino-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=neetrino_platform -p 5432:5432 -d postgres:15

# Или через Docker Compose (если настроен)
docker-compose up postgres -d
```

### 4. Запуск API
```bash
# Режим разработки
npm run dev

# Сборка
npm run build

# Продакшн
npm run start:prod
```

## API Endpoints

### Документация
- Swagger UI: http://localhost:3001/api/docs

### Основные эндпоинты

#### Demos
- `GET /demos` - Получить список демо с пагинацией
- `GET /demos/:id` - Получить демо по ID
- `POST /demos` - Создать новое демо
- `PATCH /demos/:id` - Обновить демо
- `DELETE /demos/:id` - Удалить демо (мягкое удаление)
- `POST /demos/:id/view` - Увеличить счетчик просмотров
- `POST /demos/:id/check-accessibility` - Проверить доступность

#### Vendors
- `GET /vendors` - Получить список вендоров
- `GET /vendors/:id` - Получить вендора по ID
- `GET /vendors/name/:name` - Получить вендора по имени
- `POST /vendors` - Создать нового вендора
- `PATCH /vendors/:id` - Обновить вендора
- `DELETE /vendors/:id` - Удалить вендора (мягкое удаление)
- `POST /vendors/:id/update-demo-count` - Обновить счетчик демо

#### Health
- `GET /health` - Проверка состояния API

## Структура проекта

```
src/
├── modules/
│   ├── demos/           # Модуль демо
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── demo.entity.ts
│   │   ├── demos.controller.ts
│   │   ├── demos.service.ts
│   │   └── demos.module.ts
│   ├── vendors/         # Модуль вендоров
│   │   ├── dto/
│   │   ├── vendor.entity.ts
│   │   ├── vendors.controller.ts
│   │   ├── vendors.service.ts
│   │   └── vendors.module.ts
│   └── health/          # Модуль здоровья
├── common/              # Общие утилиты
├── app.module.ts        # Главный модуль
├── app.controller.ts    # Главный контроллер
├── app.service.ts       # Главный сервис
└── main.ts             # Точка входа
```

## Модели данных

### Demo
- `id` - UUID
- `title` - Название демо
- `description` - Описание
- `url` - URL демо
- `normalizedUrl` - Нормализованный URL
- `status` - Статус (active, draft, deleted)
- `category` - Категория
- `subcategory` - Подкатегория
- `imageUrl` - URL изображения
- `screenshotUrl` - URL скриншота
- `metadata` - Дополнительные данные (JSON)
- `lastCheckedAt` - Время последней проверки
- `isAccessible` - Доступность
- `viewCount` - Количество просмотров
- `vendorId` - ID вендора
- `vendor` - Связь с вендором
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

### Vendor
- `id` - UUID
- `name` - Название вендора
- `website` - Веб-сайт
- `logoUrl` - URL логотипа
- `description` - Описание
- `status` - Статус (active, inactive, banned)
- `metadata` - Дополнительные данные (JSON)
- `demoCount` - Количество демо
- `demos` - Связь с демо
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

## Особенности

- **Мягкое удаление**: Демо и вендоры не удаляются физически, а помечаются как удаленные
- **Нормализация URL**: URL автоматически нормализуются для корректного сравнения
- **Пагинация**: Все списки поддерживают пагинацию
- **Валидация**: Все входные данные валидируются
- **Swagger**: Автоматическая документация API
- **CORS**: Настроен для работы с фронтендом
