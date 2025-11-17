# Скрипт для проверки доступности серверов
Write-Host "Проверка доступности серверов..." -ForegroundColor Cyan
Write-Host ""

$localIP = "192.168.15.237"

# Проверка веб-сервера
Write-Host "Проверка веб-сервера (порт 3000)..." -ForegroundColor Yellow
try {
    $webResponse = Invoke-WebRequest -Uri "http://${localIP}:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "Веб-сервер доступен! Status: $($webResponse.StatusCode)" -ForegroundColor Green
    Write-Host "   URL: http://${localIP}:3000" -ForegroundColor Cyan
} catch {
    Write-Host "Веб-сервер недоступен: $_" -ForegroundColor Red
}

Write-Host ""

# Проверка API сервера
Write-Host "Проверка API сервера (порт 3001)..." -ForegroundColor Yellow
try {
    $apiResponse = Invoke-WebRequest -Uri "http://${localIP}:3001/health" -TimeoutSec 5 -UseBasicParsing
    Write-Host "API сервер доступен! Status: $($apiResponse.StatusCode)" -ForegroundColor Green
    Write-Host "   URL: http://${localIP}:3001" -ForegroundColor Cyan
    Write-Host "   Swagger: http://${localIP}:3001/api/docs" -ForegroundColor Cyan
} catch {
    Write-Host "API сервер: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Проверка портов..." -ForegroundColor Yellow
$port3000 = netstat -ano | Select-String ":3000.*LISTENING"
$port3001 = netstat -ano | Select-String ":3001.*LISTENING"

if ($port3000) {
    Write-Host "Порт 3000 слушает" -ForegroundColor Green
} else {
    Write-Host "Порт 3000 не слушает" -ForegroundColor Red
}

if ($port3001) {
    Write-Host "Порт 3001 слушает" -ForegroundColor Green
} else {
    Write-Host "Порт 3001 не слушает" -ForegroundColor Red
}

Write-Host ""
Write-Host "Если серверы недоступны из браузера:" -ForegroundColor Yellow
Write-Host "1. Проверьте брандмауэр Windows" -ForegroundColor Gray
Write-Host "2. Запустите PowerShell от имени администратора" -ForegroundColor Gray
Write-Host "3. Выполните команды для открытия портов" -ForegroundColor Gray
