# 🔧 Быстрое исправление проблемы 404

## Проблема
Next.js API роут `/api/demos/xg46lpn75` возвращает 404, хотя товар есть в БД.

## Проверка по шагам

### 1. Убедитесь, что NestJS запущен
```bash
cd apps/api
npm run dev
```

Должны увидеть:
```
[Nest] ... Application is running on: http://localhost:3001
```

### 2. Проверьте логи NestJS
Когда делаете запрос к `/api/demos/xg46lpn75`, в консоли NestJS должны появиться логи:
```
[DemosService.findOne] idOrSku = xg46lpn75
[DemosService.findOne] 🔍 searching by sku: xg46lpn75
[DemosService.findOne] ✅ found by sku
```

Если видите `❌ not found by sku`, значит:
- NestJS смотрит в другую БД
- Или Prisma не подключен правильно

### 3. Проверьте DATABASE_URL
```bash
cd apps/api
cat .env | grep DATABASE_URL
```

Должно быть:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/neetrino_platform"
```

### 4. Проверьте напрямую через браузер
Откройте: http://localhost:3001/demos/xg46lpn75

Если видите JSON с товаром - NestJS работает правильно.
Если 404 - проблема в NestJS или БД.

### 5. Если NestJS возвращает 404, но товар есть в БД
Проверьте подключение к БД:
```bash
cd apps/api
npm run verify-demo xg46lpn75
```

Если товар найден через скрипт, но не через API:
- Перезапустите NestJS
- Проверьте, что Prisma Client обновлен: `npx prisma generate`

## Решение

Если всё выше не помогло, попробуйте:

1. **Перезапустить оба сервера:**
   ```bash
   # Остановите оба процесса (Ctrl+C)
   # Затем запустите заново
   ```

2. **Проверить, что товар действительно в БД:**
   ```bash
   cd apps/api
   npm run verify-demo xg46lpn75
   ```

3. **Если товар не найден, импортируйте его:**
   ```bash
   cd apps/api
   npm run import-single xg46lpn75
   ```

4. **Проверить логи Next.js API:**
   В консоли Next.js должны быть логи:
   ```
   [API /api/demos/[id]] id = xg46lpn75
   [API /api/demos/[id]] fetching from NestJS: http://localhost:3001/demos/xg46lpn75
   [API /api/demos/[id]] NestJS response status: 200
   ```

Если статус 404, значит NestJS не находит товар - проверьте логи NestJS.















