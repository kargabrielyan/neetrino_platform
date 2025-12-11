# 🔴 ПРОБЛЕМА: Товар не находится по ID/SKU

## 📋 Описание проблемы

При переходе на страницу продукта `/catalog/xg46lpn75` (или любой другой SKU) система показывает ошибку:
```
Товар не найден
ID товара: xg46lpn75
```

**Что происходит:**
1. Пользователь кликает на карточку товара в каталоге
2. Открывается страница `/catalog/[id]` где `id` = SKU товара (например, `xg46lpn75`)
3. API `/api/demos/[id]` пытается найти товар, но возвращает 404
4. Страница показывает ошибку "Товар не найден"

**Ожидаемое поведение:**
- Товар должен находиться по SKU
- Страница продукта должна отображать информацию о товаре

---

## 🏗️ Технический стек проекта

### Архитектура
- **Монорепо** с Turborepo
- **Frontend:** Next.js 15.5.3 (порт 3000)
- **Backend:** NestJS 10.4.20 (порт 3001)
- **База данных:** PostgreSQL с Prisma ORM
- **Язык:** TypeScript

### Frontend (apps/web)
- **Framework:** Next.js 15.5.3 (App Router)
- **React:** 19.1.1
- **Стилизация:** Tailwind CSS
- **UI компоненты:** shadcn/ui, Lucide React
- **Анимации:** Framer Motion
- **Аутентификация:** NextAuth.js 5.0.0-beta.25

### Backend (apps/api)
- **Framework:** NestJS 10.4.20
- **ORM:** Prisma 6.16.2 + TypeORM 0.3.17 (legacy)
- **База данных:** PostgreSQL
- **Валидация:** class-validator, class-transformer
- **Документация:** Swagger/OpenAPI

### База данных
- **СУБД:** PostgreSQL
- **ORM:** Prisma Client
- **Схема:** `apps/api/prisma/schema.prisma`
- **Модель Demo:**
  ```prisma
  model Demo {
    id            String   @id @default(uuid())  // UUID (автогенерируется)
    sku           String?  @db.VarChar(255)       // SKU из CSV/JSON (например, xg46lpn75)
    title         String   @db.VarChar(255)
    description   String?
    url           String   @db.VarChar(500)
    // ... другие поля
    metadata      Json?                          // JSON поле (может содержать sku)
  }
  ```

### Источники данных
1. **PostgreSQL** (основной) - через Prisma
2. **CSV файл** (`data/demos.json`) - fallback через `csv-demo-loader.ts`
3. **NestJS API** (`http://localhost:3001`) - основной API
4. **Next.js API Routes** (`/api/*`) - прокси к NestJS API

---

## 🔍 Детали проблемы

### Текущая логика поиска товара

**API роут:** `apps/web/app/api/demos/[id]/route.ts`

1. Пробует найти через NestJS API: `GET /demos/{id}` (ищет по UUID)
2. Если не найдено, пробует через search API с большим лимитом
3. Если не найдено, пробует через CSV fallback

**Проблема:** 
- В базе данных `id` - это UUID (автогенерируется)
- В каталоге используется SKU (например, `xg46lpn75`) как идентификатор
- SKU хранится в поле `sku` или в `metadata.sku`
- Поиск по UUID не находит товар, если передан SKU

### Что уже исправлено

1. ✅ Добавлено поле `sku` в схему Prisma
2. ✅ Обновлен `demos.service.findOne()` - ищет по UUID, затем по SKU, затем по `metadata.sku`
3. ✅ Обновлен `search.service.ts` - поиск по SKU и возврат SKU как `id`
4. ✅ Обновлен скрипт импорта - сохраняет SKU из исходного ID

### Что нужно сделать

1. **Обновить существующие записи в БД:**
   - Заполнить поле `sku` для всех существующих товаров
   - Взять SKU из `metadata.sku` или из исходного ID при импорте

2. **Проверить импорт данных:**
   - Убедиться, что при импорте из `data/demos.json` поле `sku` заполняется
   - SKU должен браться из поля `id` в JSON файле

3. **Проверить поиск:**
   - Убедиться, что `demos.service.findOne()` правильно ищет по SKU
   - Проверить, что API роут правильно обрабатывает SKU

---

## 🛠️ Команды для диагностики

```bash
# Проверить подключение к БД
cd apps/api
npx prisma studio  # Открыть Prisma Studio на http://localhost:5555

# Проверить данные в БД
# В Prisma Studio проверить таблицу "demos", найти товар с SKU xg46lpn75

# Запустить импорт данных
npm run import-json

# Проверить API
curl http://localhost:3001/demos/xg46lpn75
curl http://localhost:3000/api/demos/xg46lpn75
```

---

## 📝 Структура проекта

```
neetrino_platform/
├── apps/
│   ├── web/                    # Next.js фронтенд
│   │   ├── app/
│   │   │   ├── catalog/
│   │   │   │   ├── [id]/       # Страница продукта
│   │   │   │   └── page.tsx    # Каталог
│   │   │   └── api/
│   │   │       └── demos/
│   │   │           └── [id]/  # API роут для получения товара
│   │   └── lib/
│   │       └── csv-demo-loader.ts  # Fallback к CSV данным
│   └── api/                    # NestJS бэкенд
│       ├── src/
│       │   └── modules/
│       │       ├── demos/      # Модуль товаров
│       │       └── search/     # Модуль поиска
│       └── prisma/
│           └── schema.prisma   # Схема БД
├── data/
│   └── demos.json              # Исходные данные (100,000+ товаров)
└── packages/
    ├── ui/                     # UI компоненты
    └── types/                  # TypeScript типы
```

---

## 🎯 Цель

Нужно, чтобы товар находился по SKU (например, `xg46lpn75`) и отображался на странице продукта `/catalog/xg46lpn75` со всей информацией:
- Iframe с переключателями ширины
- Галерея изображений
- Технические характеристики
- Кнопка подписки
- Похожие товары

---

## 💡 Возможные решения

1. **Создать скрипт для обновления существующих записей:**
   - Взять SKU из `metadata.sku` или из исходного ID
   - Заполнить поле `sku` для всех товаров в БД

2. **Улучшить логику поиска:**
   - Сначала искать по `sku` (если передан SKU-подобный ID)
   - Затем по UUID (если передан UUID)
   - Затем по `metadata.sku`

3. **Проверить импорт:**
   - Убедиться, что при импорте из JSON поле `sku` заполняется из поля `id`

---

**Дата создания:** 2025-01-XX
**Приоритет:** Высокий
**Статус:** В работе











