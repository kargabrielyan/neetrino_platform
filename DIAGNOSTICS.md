# 🔍 Диагностика проблемы с поиском товара по SKU

## 📋 Пошаговая диагностика

### Шаг 1: Проверка БД

**Запустите диагностический скрипт:**

```bash
cd apps/api
npm run check-sku xg46lpn75
```

Или через Prisma Studio:
```bash
cd apps/api
npx prisma studio
```

Откройте таблицу `Demo` и отфильтруйте по `sku = xg46lpn75`

**Что проверить:**
- ✅ Есть ли запись с `sku = 'xg46lpn75'`?
- ✅ Есть ли запись с `metadata.sku = 'xg46lpn75'`?
- ✅ Есть ли запись с `metadata.id = 'xg46lpn75'`?

**Если НЕ найдено:**
- Запустите: `npm run fill-sku` (заполнит sku из metadata)
- Или: `npm run import-json` (переимпортирует данные)

---

### Шаг 2: Проверка NestJS API

**Проверьте напрямую:**

```bash
curl -i http://localhost:3001/demos/xg46lpn75
```

**Смотрите логи NestJS** (в консоли где запущен `npm run dev`):

Должны увидеть:
```
[DemosService.findOne] idOrSku = xg46lpn75
[DemosService.findOne] isUUID: false
[DemosService.findOne] 🔍 searching by sku: xg46lpn75
[DemosService.findOne] ✅ found by sku
```

**Если видите `❌ not found by sku`:**
- Проверьте, что NestJS смотрит в ту же БД (проверьте `DATABASE_URL` в `.env`)
- Проверьте, что Prisma схема синхронизирована: `npx prisma db push`

**Ожидаемый результат:**
- `200 OK` + JSON товара

---

### Шаг 3: Проверка Next.js API роут

**Проверьте:**

```bash
curl -i http://localhost:3000/api/demos/xg46lpn75
```

**Смотрите логи Next.js** (в консоли где запущен `npm run dev`):

Должны увидеть:
```
[API /api/demos/[id]] id = xg46lpn75
[API /api/demos/[id]] fetching from NestJS: http://localhost:3001/demos/xg46lpn75
[API /api/demos/[id]] NestJS response status: 200
[API /api/demos/[id]] ✅ success, returning data
```

**Ожидаемый результат:**
- `200 OK` + JSON товара (тот же, что от NestJS)

---

### Шаг 4: Проверка страницы

**Откройте в браузере:**

```
http://localhost:3000/catalog/xg46lpn75
```

**Откройте DevTools (F12) → Console**

Должны увидеть:
```
[ProductPage] 🔄 Fetching demo: /api/demos/xg46lpn75
[ProductPage] Response status: 200
[ProductPage] ✅ Demo loaded
[ProductPage] data: { id: '...', sku: 'xg46lpn75', title: '...' }
```

**Если видите ошибку:**
- Проверьте, что `data` не пустой
- Проверьте, что `data.id` или `data.sku` существует
- Проверьте условие `if (error || !demo)` - возможно, оно срабатывает неправильно

---

## 🎯 Типичные проблемы и решения

### Проблема 1: "Товар не найден" на шаге 1 (БД)

**Причина:** Товара нет в БД или `sku` не заполнен

**Решение:**
```bash
cd apps/api
npm run fill-sku
npm run check-sku xg46lpn75  # Проверить результат
```

### Проблема 2: NestJS возвращает 404, хотя товар есть в БД

**Причина:** 
- NestJS смотрит в другую БД (другой `DATABASE_URL`)
- Prisma схема не синхронизирована

**Решение:**
```bash
cd apps/api
# Проверить DATABASE_URL в .env
cat .env | grep DATABASE_URL

# Синхронизировать схему
npx prisma db push
npx prisma generate
```

### Проблема 3: Next.js API возвращает 404, хотя NestJS возвращает 200

**Причина:** Next.js API роут что-то портит

**Решение:**
- Проверьте логи Next.js API
- Убедитесь, что `id` правильно передается в NestJS
- Проверьте, что нет проблем с кодированием URL

### Проблема 4: Страница показывает "Товар не найден", хотя API возвращает 200

**Причина:** Страница неправильно обрабатывает ответ

**Решение:**
- Проверьте логи в консоли браузера
- Убедитесь, что `data` не пустой
- Проверьте условие `if (error || !demo)`
- Убедитесь, что `setDemo(data)` вызывается

---

## 🔧 Быстрая проверка всех слоёв

```bash
# 1. Проверка БД
cd apps/api
npm run check-sku xg46lpn75

# 2. Проверка NestJS API
curl -i http://localhost:3001/demos/xg46lpn75

# 3. Проверка Next.js API
curl -i http://localhost:3000/api/demos/xg46lpn75

# 4. Проверка страницы
# Откройте в браузере: http://localhost:3000/catalog/xg46lpn75
# Откройте DevTools → Console
```

---

## 📊 Логи для анализа

После запуска всех проверок соберите логи:

1. **Логи NestJS** (консоль где запущен `npm run dev` в `apps/api`)
2. **Логи Next.js** (консоль где запущен `npm run dev` в `apps/web`)
3. **Логи браузера** (DevTools → Console)
4. **Результат `npm run check-sku`**

С этими логами будет видно, на каком именно слое ломается цепочка.











