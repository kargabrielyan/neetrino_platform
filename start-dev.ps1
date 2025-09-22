Write-Host "🚀 Запуск Neetrino Platform..." -ForegroundColor Green
Write-Host ""

Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔧 Запуск бэкенда (NestJS) на порту 3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/api; npm run dev"

Write-Host ""
Write-Host "⏳ Ожидание запуска бэкенда (5 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎨 Запуск фронтенда (Next.js) на порту 3000..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/web; npm run dev"

Write-Host ""
Write-Host "✅ Проект запущен!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Фронтенд: http://localhost:3000" -ForegroundColor Blue
Write-Host "🔌 API: http://localhost:3001" -ForegroundColor Blue
Write-Host "📚 Swagger: http://localhost:3001/api/docs" -ForegroundColor Blue
Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
