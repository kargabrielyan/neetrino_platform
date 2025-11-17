# Скрипт для запуска приложения с доступом из локальной сети
# Все устройства в Wi-Fi сети смогут получить доступ к приложению

Write-Host "🌐 Запуск Neetrino Platform для локальной сети..." -ForegroundColor Green
Write-Host ""

# Автоматическое определение локального IP адреса
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' -or ($_.IPAddress -like '172.*' -and [int]($_.IPAddress.Split('.')[1]) -ge 16 -and [int]($_.IPAddress.Split('.')[1]) -le 31) } | Select-Object -First 1).IPAddress

if (-not $localIP) {
    Write-Host "⚠️  Не удалось определить локальный IP адрес. Используется 192.168.15.237" -ForegroundColor Yellow
    $localIP = "192.168.15.237"
}

Write-Host "📱 Ваш локальный IP: $localIP" -ForegroundColor Yellow
Write-Host "🔗 Доступ к приложению: http://$localIP:3000" -ForegroundColor Cyan
Write-Host "🔗 Доступ к API: http://$localIP:3001" -ForegroundColor Cyan
Write-Host ""

# Установка переменных окружения для API
$env:API_HOST = "0.0.0.0"
$env:API_PORT = "3001"
$env:LOCAL_IP = $localIP
$env:API_URL = "http://$localIP:3001"
$env:FRONTEND_URL = "http://$localIP:3000"
$env:NEXTAUTH_URL = "http://$localIP:3000"

# Установка переменных окружения для Next.js
$env:NEXT_PUBLIC_API_URL = "http://$localIP:3001"

Write-Host "⚙️  Переменные окружения установлены" -ForegroundColor Green
Write-Host ""

# Запуск API сервера в фоне
Write-Host "🚀 Запуск API сервера..." -ForegroundColor Yellow
$apiProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "apps/api" -PassThru -WindowStyle Minimized

# Ждем немного, чтобы API запустился
Start-Sleep -Seconds 5

# Запуск веб-приложения
Write-Host "🌐 Запуск веб-приложения..." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Приложение запущено!" -ForegroundColor Green
Write-Host "📱 Откройте в браузере: http://$localIP:3000" -ForegroundColor Cyan
Write-Host "📚 API документация: http://$localIP:3001/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Другие устройства в вашей Wi-Fi сети могут получить доступ по этим адресам" -ForegroundColor Yellow
Write-Host "🛑 Для остановки нажмите Ctrl+C" -ForegroundColor Red
Write-Host ""

# Запуск веб-приложения в текущем окне с доступом по IP
Set-Location "apps/web"
npm run dev:network

