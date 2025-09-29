@echo off
echo 🚀 Запуск локального сервера и туннеля...
echo.

echo 📡 Запуск тестового сервера на порту 3001...
start "Test Server" cmd /k "node test-server.js"

echo.
echo ⏳ Ожидание запуска сервера (3 секунды)...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 Создание публичного туннеля...
start "Tunnel" cmd /k "lt --port 3001"

echo.
echo ✅ Готово!
echo.
echo 📋 Инструкции:
echo 1. В окне туннеля появится публичный URL (например: https://abc123.loca.lt)
echo 2. Скопируйте этот URL
echo 3. В WordPress плагине замените API URL на: [URL]/import/push
echo.
echo Пример: https://abc123.loca.lt/import/push
echo.
pause

