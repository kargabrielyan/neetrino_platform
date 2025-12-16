# 🚀 Инструкция по деплою на Vercel

## ✅ Что было исправлено

1. **Исправлен vercel.json** - добавлен `rootDirectory: "apps/web"` для правильной работы с монорепо
2. **Убраны все хардкоды localhost:3001** - теперь используются переменные окружения
3. **Исправлен CSP** - убрана жесткая привязка к localhost
4. **Унифицированы переменные окружения** - все API routes используют `NEXT_PUBLIC_API_URL`

## 📋 Шаги для деплоя

### 1. Подготовка проекта

Убедитесь, что все изменения закоммичены:
```bash
git add .
git commit -m "Исправления для деплоя на Vercel"
git push
```

### 2. Подключение к Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Импортируйте ваш GitHub репозиторий
3. Vercel автоматически определит Next.js проект

### 3. Настройка проекта в Vercel

В настройках проекта (`Settings` → `General`):

- **Framework Preset:** Next.js
- **Root Directory:** `apps/web` (важно!)
- **Build Command:** `npm run build` (будет выполняться из `apps/web`)
- **Output Directory:** `.next` (по умолчанию)

### 4. Переменные окружения

Добавьте следующие переменные окружения в Vercel (`Settings` → `Environment Variables`):

#### Обязательные переменные:

```env
# База данных (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database

# API URL (если у вас отдельный бэкенд)
NEXT_PUBLIC_API_URL=https://your-api-url.com
# или
API_URL=https://your-api-url.com

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Секретные ключи
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

#### Опциональные переменные:

```env
# Feature Flags
PARSING_ENABLED=false
CHECKING_ENABLED=false
AI_ENABLED=false

# Email (если используется)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 5. Настройка базы данных

Для продакшена рекомендуется использовать:
- **Vercel Postgres** (встроенная в Vercel)
- **Supabase** (бесплатный тариф)
- **Neon** (бесплатный тариф)
- **Railway** (бесплатный тариф)

После создания БД:
1. Скопируйте `DATABASE_URL`
2. Добавьте в переменные окружения Vercel
3. Выполните миграции Prisma:

```bash
# Локально с продакшн DATABASE_URL
cd apps/web
npx prisma migrate deploy
```

### 6. Деплой

1. Нажмите `Deploy` в Vercel
2. Дождитесь завершения билда
3. Проверьте логи на наличие ошибок

## 🔧 Возможные проблемы и решения

### Проблема: Билд падает с ошибкой "Cannot find module"

**Решение:** Убедитесь, что `rootDirectory` установлен в `apps/web` в настройках Vercel.

### Проблема: Ошибки подключения к базе данных

**Решение:** 
1. Проверьте `DATABASE_URL` в переменных окружения
2. Убедитесь, что БД доступна из интернета (не localhost)
3. Проверьте firewall настройки БД

### Проблема: API запросы не работают

**Решение:**
1. Проверьте `NEXT_PUBLIC_API_URL` в переменных окружения
2. Убедитесь, что API доступен из интернета
3. Проверьте CORS настройки на бэкенде

### Проблема: Prisma Client не найден

**Решение:**
Добавьте в `package.json` скрипт для генерации Prisma Client:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Или добавьте в `vercel.json`:
```json
{
  "buildCommand": "cd apps/web && npx prisma generate && npm run build"
}
```

## 📝 Структура vercel.json

Текущая конфигурация:
```json
{
  "version": 2,
  "buildCommand": "cd apps/web && npm run build",
  "devCommand": "cd apps/web && npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next",
  "rootDirectory": "apps/web"
}
```

## ✅ Чеклист перед деплоем

- [ ] Все изменения закоммичены и запушены
- [ ] `vercel.json` настроен правильно
- [ ] Все переменные окружения добавлены в Vercel
- [ ] База данных создана и доступна
- [ ] `DATABASE_URL` указан правильно
- [ ] `NEXT_PUBLIC_API_URL` указан (если используется внешний API)
- [ ] `NEXTAUTH_SECRET` сгенерирован и добавлен
- [ ] `NEXTAUTH_URL` указан (домен Vercel)
- [ ] Миграции Prisma выполнены
- [ ] Билд проходит локально без ошибок

## 🎉 После успешного деплоя

1. Проверьте работу сайта
2. Проверьте API endpoints
3. Проверьте подключение к базе данных
4. Настройте кастомный домен (если нужно)

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи билда в Vercel
2. Проверьте логи runtime в Vercel
3. Убедитесь, что все переменные окружения установлены
4. Проверьте, что база данных доступна

---

**Успешного деплоя! 🚀**

