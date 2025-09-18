@echo off
echo 🚀 Запуск NEETRINO PLATFORM...
echo.

REM Добавляем Node.js в PATH
set PATH=%PATH%;C:\Users\LOQ\neetrino_platform\node-v24.4.1-win-x64

REM Проверяем версии
echo 📋 Проверка версий:
node --version
npm --version
echo.

REM Запускаем проект
echo 🚀 Запуск проекта...
npm run dev

REM Пауза для просмотра результатов
pause

