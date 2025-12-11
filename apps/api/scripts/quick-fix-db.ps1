# Быстрое решение проблемы с базой данных
# Запустите: .\scripts\quick-fix-db.ps1

Write-Host "🔧 Быстрая настройка базы данных PostgreSQL`n" -ForegroundColor Cyan

# Проверяем наличие .env файла
$envPath = Join-Path $PSScriptRoot "..\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
    Write-Host "   Создайте файл apps/api/.env на основе env.example`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Текущие настройки в .env:" -ForegroundColor Yellow
Get-Content $envPath | Select-String -Pattern "DATABASE_URL|DB_PASSWORD" | ForEach-Object {
    Write-Host "   $_" -ForegroundColor Gray
}
Write-Host ""

# Проверяем подключение к PostgreSQL
Write-Host "🔌 Проверка подключения к PostgreSQL..." -ForegroundColor Cyan
$testConnection = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($testConnection) {
    Write-Host "✅ PostgreSQL доступен на порту 5432`n" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL недоступен на порту 5432" -ForegroundColor Red
    Write-Host "   Убедитесь, что PostgreSQL запущен`n" -ForegroundColor Yellow
    exit 1
}

# Предлагаем варианты
Write-Host "📝 Что нужно сделать:" -ForegroundColor Cyan
Write-Host ""
Write-Host "ВАРИАНТ 1: Если знаете пароль PostgreSQL" -ForegroundColor Yellow
Write-Host "   1. Откройте файл: apps/api/.env" -ForegroundColor White
Write-Host "   2. Замените 'password' на ваш реальный пароль" -ForegroundColor White
Write-Host "   3. Запустите: npm run setup-db" -ForegroundColor White
Write-Host ""
Write-Host "ВАРИАНТ 2: Создать базу через pgAdmin" -ForegroundColor Yellow
Write-Host "   1. Откройте pgAdmin" -ForegroundColor White
Write-Host "   2. Создайте базу данных 'neetrino_platform'" -ForegroundColor White
Write-Host "   3. Запустите: npx prisma db push" -ForegroundColor White
Write-Host ""
Write-Host "ВАРИАНТ 3: Использовать Docker" -ForegroundColor Yellow
Write-Host "   Запустите PostgreSQL в Docker с известным паролем" -ForegroundColor White
Write-Host ""

# Спрашиваем, хочет ли пользователь попробовать запустить скрипт
$response = Read-Host "Попробовать запустить setup-db сейчас? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "`n🚀 Запуск скрипта настройки...`n" -ForegroundColor Cyan
    Set-Location (Join-Path $PSScriptRoot "..")
    npm run setup-db
} else {
    Write-Host "`n💡 Обновите пароль в .env и запустите: npm run setup-db" -ForegroundColor Yellow
}



