# 🔐 НАСТРОЙКА СИСТЕМЫ АУТЕНТИФИКАЦИИ

## ✅ ЧТО РЕАЛИЗОВАНО

### 🏗️ Система аутентификации
- **NextAuth.js** с поддержкой email/password и OAuth
- **Prisma** для работы с базой данных
- **bcryptjs** для хеширования паролей
- **JWT** токены для сессий

### 👥 Система ролей
- **USER** - обычные пользователи
- **ADMIN** - администраторы с доступом к админ-панели

### 📱 Страницы и компоненты
- **`/auth/signin`** - страница входа
- **`/auth/signup`** - страница регистрации  
- **`/my-account`** - личный кабинет пользователя
- **`/admin`** - защищенная админ-панель
- **Обновленная навигация** с пользовательским меню

## 🚀 УСТАНОВКА И НАСТРОЙКА

### 1. Установите зависимости
```bash
cd apps/web
npm install bcryptjs @types/bcryptjs
```

### 2. Настройте переменные окружения
Добавьте в `.env.local`:
```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OAuth (опционально)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. Создайте админа
```bash
cd apps/web
npm run create-admin
```

Это создаст админа с данными:
- **Email:** admin@neetrino.com
- **Password:** admin123
- **Role:** ADMIN

### 4. Запустите проект
```bash
npm run dev
```

## 🔧 ИСПОЛЬЗОВАНИЕ

### Вход в систему
1. Перейдите на `/auth/signin`
2. Введите email и пароль
3. После входа доступно меню пользователя в навигации

### Регистрация
1. Перейдите на `/auth/signup`
2. Заполните форму регистрации
3. После регистрации автоматически войдете в систему

### Личный кабинет
- Доступен по адресу `/my-account`
- Позволяет редактировать профиль
- Показывает статистику пользователя

### Админ-панель
- Доступна по адресу `/admin`
- Защищена проверкой роли ADMIN
- Неавторизованные пользователи перенаправляются на страницу входа

## 🛡️ БЕЗОПАСНОСТЬ

### Защита админ-панели
- Используется компонент `AdminGuard`
- Проверка роли пользователя
- Автоматическое перенаправление неавторизованных

### Хеширование паролей
- Используется bcryptjs с солью
- Пароли не хранятся в открытом виде

### Валидация данных
- Проверка email на уникальность
- Минимальная длина пароля (6 символов)
- Валидация форм на клиенте и сервере

## 📊 СТРУКТУРА БАЗЫ ДАННЫХ

### Таблица users
```sql
- id: String (UUID)
- name: String?
- email: String (unique)
- password: String (hashed)
- role: String (USER/ADMIN)
- image: String?
- createdAt: DateTime
- updatedAt: DateTime
```

## 🔄 API ENDPOINTS

### Аутентификация
- `POST /api/auth/register` - регистрация пользователя
- `POST /api/auth/signin` - вход в систему (NextAuth)
- `POST /api/auth/signout` - выход из системы

### Пользователи
- `PUT /api/user/profile` - обновление профиля

## 🎨 UI/UX ОСОБЕННОСТИ

### Дизайн
- **Liquid Glass** эффекты для форм
- **Адаптивный дизайн** для всех устройств
- **Анимации** с Framer Motion
- **Темная/светлая** темы

### Навигация
- **Пользовательское меню** с аватаром
- **Условное отображение** кнопок входа/регистрации
- **Доступ к админке** только для админов

## 🐛 ОТЛАДКА

### Проверка сессии
```javascript
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
console.log('Session:', session);
console.log('Status:', status);
```

### Проверка роли
```javascript
if (session?.user?.role === 'ADMIN') {
  // Показать админ-функции
}
```

## 📝 ДОПОЛНИТЕЛЬНЫЕ ВОЗМОЖНОСТИ

### OAuth провайдеры
- Google OAuth (настроить в Google Console)
- GitHub OAuth (настроить в GitHub Settings)

### Расширение ролей
Можно добавить новые роли в enum:
```typescript
enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  // ...
}
```

## ✅ ГОТОВО К ИСПОЛЬЗОВАНИЮ!

Система аутентификации полностью настроена и готова к использованию. Все страницы защищены, роли работают, и пользователи могут регистрироваться и входить в систему.

