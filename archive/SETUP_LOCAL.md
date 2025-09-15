# Локальная настройка Neetrino Platform

## Требования

- **Node.js:** 18+ (рекомендуется 20 LTS)
- **npm:** 9+ (или pnpm/yarn)
- **Git:** для клонирования репозитория

## Быстрый старт

### 1. Установка зависимостей

```bash
# Установка всех зависимостей монорепо
npm install
```

### 2. Настройка окружения

```bash
# Копирование файла окружения
cp .env.example .env

# Редактирование переменных (опционально)
# nano .env
```

### 3. Запуск приложения

```bash
# Запуск всех сервисов (веб + API)
npm run dev
```

**Или запуск по отдельности:**

```bash
# Терминал 1: Веб-приложение (порт 3000)
cd apps/web
npm run dev

# Терминал 2: API (порт 3001)
cd apps/api
npm run dev
```

## Проверка работы

### Веб-приложение
- **URL:** http://localhost:3000
- **Ожидаемый результат:** Главная страница Neetrino Platform

### API
- **URL:** http://localhost:3001
- **Swagger документация:** http://localhost:3001/api/docs
- **Health check:** http://localhost:3001/health

## Команды разработки

### Основные команды

```bash
# Разработка (все сервисы)
npm run dev

# Сборка (все сервисы)
npm run build

# Запуск продакшн версии
npm run start

# Линтинг
npm run lint

# Форматирование кода
npm run format

# Очистка
npm run clean
```

### Команды для отдельных приложений

```bash
# Веб-приложение
cd apps/web
npm run dev          # Запуск на порту 3000
npm run build        # Сборка
npm run start        # Продакшн запуск
npm run lint         # Линтинг

# API
cd apps/api
npm run dev          # Запуск на порту 3001
npm run build        # Сборка
npm run start        # Продакшн запуск
npm run lint         # Линтинг
```

## Структура портов

| Сервис | Порт | URL | Описание |
|--------|------|-----|----------|
| Web | 3000 | http://localhost:3000 | Next.js приложение |
| API | 3001 | http://localhost:3001 | NestJS API |
| API Docs | 3001 | http://localhost:3001/api/docs | Swagger документация |

## Переменные окружения

Основные переменные в `.env`:

```env
# Порты
PORT=3000
API_PORT=3001

# API URL
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# База данных (для будущего использования)
DATABASE_URL=postgresql://username:password@localhost:5432/neetrino_platform

# Redis (для будущего использования)
REDIS_URL=redis://localhost:6379

# Фича-флаги
PARSING_ENABLED=false
CHECKING_ENABLED=false
MEDIA_GENERATION_ENABLED=false
```

## Устранение проблем

### Порт 3000 занят

**Windows:**
```cmd
# Найти процесс на порту 3000
netstat -ano | findstr :3000

# Завершить процесс (замените PID на реальный)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Найти процесс на порту 3000
lsof -ti:3000

# Завершить процесс
kill -9 $(lsof -ti:3000)
```

### Ошибки зависимостей

```bash
# Очистка и переустановка
npm run clean
rm -rf node_modules
npm install
```

### Проблемы с TypeScript

```bash
# Проверка типов
npm run type-check

# Пересборка типов
cd packages/types && npm run build
cd packages/ui && npm run build
```

## Разработка

### Добавление новых пакетов

```bash
# В корне проекта
npm install <package-name> --workspace=apps/web
npm install <package-name> --workspace=apps/api
npm install <package-name> --workspace=packages/ui
```

### Создание новых компонентов

```bash
# UI компоненты
cd packages/ui/src/components
# Создать новый компонент и экспортировать в index.ts
```

### API разработка

```bash
# Создание нового модуля
cd apps/api/src/modules
# Создать папку модуля с controller, service, module
```

## Производственный запуск

```bash
# Сборка всех приложений
npm run build

# Запуск продакшн версии
npm run start
```

## Мониторинг

- **Логи:** Выводятся в консоль при `npm run dev`
- **Hot Reload:** Автоматическая перезагрузка при изменениях
- **TypeScript:** Проверка типов в реальном времени
