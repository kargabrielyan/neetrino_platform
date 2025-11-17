@echo off
echo 🌐 Запуск Neetrino Platform для локальной сети...
echo 📱 Ваш локальный IP: 192.168.15.237
echo 🔗 Доступ к приложению: http://192.168.15.237:3000
echo 🔗 Доступ к API: http://192.168.15.237:3001
echo.

REM Установка переменных окружения
set API_HOST=0.0.0.0
set API_PORT=3001
set API_URL=http://192.168.15.237:3001
set FRONTEND_URL=http://192.168.15.237:3000
set NEXTAUTH_URL=http://192.168.15.237:3000

echo ⚙️  Переменные окружения установлены

REM Запуск API сервера в новом окне
echo 🚀 Запуск API сервера...
start "API Server" cmd /k "cd apps/api && npm run dev"

REM Ждем немного, чтобы API запустился
timeout /t 3 /nobreak > nul

REM Запуск веб-приложения
echo 🌐 Запуск веб-приложения...
echo.
echo ✅ Приложение запущено!
echo 📱 Откройте в браузере: http://192.168.15.237:3000
echo 📚 API документация: http://192.168.15.237:3001/api/docs
echo.
echo 💡 Другие устройства в вашей Wi-Fi сети могут получить доступ по этим адресам
echo 🛑 Для остановки закройте это окно

cd apps/web
npm run dev

