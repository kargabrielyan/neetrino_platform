@echo off
echo 🚀 Запуск Neetrino Platform...
echo.

echo 📦 Установка зависимостей...
call npm install

echo.
echo 🔧 Запуск бэкенда (NestJS) на порту 3001...
start "Backend API" cmd /k "cd apps/api && npm run dev"

echo.
echo ⏳ Ожидание запуска бэкенда (5 секунд)...
timeout /t 5 /nobreak > nul

echo.
echo 🎨 Запуск фронтенда (Next.js) на порту 3000...
start "Frontend Web" cmd /k "cd apps/web && npm run dev"

echo.
echo ✅ Проект запущен!
echo.
echo 🌐 Фронтенд: http://localhost:3000
echo 🔌 API: http://localhost:3001
echo 📚 Swagger: http://localhost:3001/api/docs
echo.
echo Нажмите любую клавишу для выхода...
pause > nul
