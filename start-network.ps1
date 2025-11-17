Write-Host "🌐 Запуск Neetrino Platform для доступа по сети..." -ForegroundColor Green
Write-Host ""

# Получаем IP адрес
$ipAddress = "192.168.15.237"
Write-Host "📍 IP адрес в сети: $ipAddress" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔧 Запуск бэкенда (NestJS) на $ipAddress:3001..." -ForegroundColor Cyan
$env:API_HOST = "0.0.0.0"
$env:API_PORT = "3001"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/api; `$env:API_HOST='0.0.0.0'; npm run dev"

Write-Host ""
Write-Host "⏳ Ожидание запуска бэкенда (5 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎨 Запуск фронтенда (Next.js) на $ipAddress:3000..." -ForegroundColor Magenta
$env:HOST = "0.0.0.0"
$env:NEXT_PUBLIC_API_URL = "http://$ipAddress:3001"
$env:NEXTAUTH_URL = "http://$ipAddress:3000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/web; `$env:HOST='0.0.0.0'; `$env:NEXT_PUBLIC_API_URL='http://$ipAddress:3001'; `$env:NEXTAUTH_URL='http://$ipAddress:3000'; npm run dev"

Write-Host ""
Write-Host "✅ Серверы запущены для доступа по сети!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Фронтенд: http://$ipAddress:3000" -ForegroundColor Blue
Write-Host "🔌 API: http://$ipAddress:3001" -ForegroundColor Blue
Write-Host "📚 Swagger: http://$ipAddress:3001/api/docs" -ForegroundColor Blue
Write-Host ""
Write-Host "📱 Другие устройства в WiFi могут подключаться по этим адресам" -ForegroundColor Green
Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
