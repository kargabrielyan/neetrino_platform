# Скрипт для поиска пароля PostgreSQL и создания базы данных
# Запустите: .\scripts\find-postgres-password.ps1

Write-Host "🔍 Поиск пароля PostgreSQL и настройка базы данных`n" -ForegroundColor Cyan

# Проверяем наличие pgAdmin
$pgAdminPath = @(
    "$env:ProgramFiles\pgAdmin 4\runtime\psql.exe",
    "${env:ProgramFiles(x86)}\pgAdmin 4\runtime\psql.exe",
    "$env:LOCALAPPDATA\Programs\pgAdmin 4\runtime\psql.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($pgAdminPath) {
    Write-Host "✅ Найден pgAdmin: $pgAdminPath`n" -ForegroundColor Green
    Write-Host "💡 Рекомендация: Откройте pgAdmin и создайте базу данных вручную:" -ForegroundColor Yellow
    Write-Host "   1. Откройте pgAdmin" -ForegroundColor White
    Write-Host "   2. Подключитесь к серверу PostgreSQL (пароль может быть сохранен)" -ForegroundColor White
    Write-Host "   3. Правой кнопкой на 'Databases' → 'Create' → 'Database'" -ForegroundColor White
    Write-Host "   4. Имя: neetrino_platform" -ForegroundColor White
    Write-Host "   5. Нажмите 'Save'`n" -ForegroundColor White
}

# Пробуем стандартные пароли
Write-Host "🔐 Попытка подключения с стандартными паролями...`n" -ForegroundColor Cyan

$commonPasswords = @("postgres", "admin", "password", "", "root", "123456")
$envPath = Join-Path $PSScriptRoot "..\.env"

if (-not (Test-Path $envPath)) {
    Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $envPath -Raw
$dbHost = "localhost"
$dbPort = "5432"
$dbUser = "postgres"

foreach ($pass in $commonPasswords) {
    Write-Host "   Пробую пароль: '$pass'..." -ForegroundColor Gray -NoNewline
    
    try {
        # Пробуем подключиться через Node.js скрипт
        $testScriptPath = Join-Path $PSScriptRoot "test-postgres-connection.js"
        $result = node $testScriptPath $dbHost $dbPort $dbUser $pass 2>&1
        
        if ($result -match "SUCCESS") {
            Write-Host " ✅ РАБОТАЕТ!`n" -ForegroundColor Green
            Write-Host "🎉 Найден рабочий пароль: '$pass'`n" -ForegroundColor Green
            
            # Обновляем .env файл
            Write-Host "📝 Обновляю файл .env..." -ForegroundColor Cyan
            $newEnvContent = $envContent -replace "DATABASE_URL=postgresql://postgres:[^@]+@", "DATABASE_URL=postgresql://postgres:$pass@"
            $newEnvContent = $newEnvContent -replace "DB_PASSWORD=[^\r\n]+", "DB_PASSWORD=$pass"
            $newEnvContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline
            
            Write-Host "✅ Файл .env обновлен!`n" -ForegroundColor Green
            
            # Пробуем создать базу данных
            Write-Host "📦 Создание базы данных neetrino_platform..." -ForegroundColor Cyan
            $createDbScriptPath = Join-Path $PSScriptRoot "create-database.js"
            $createResult = node $createDbScriptPath $dbHost $dbPort $dbUser $pass "neetrino_platform" 2>&1
            
            if ($createResult -match "SUCCESS") {
                Write-Host "✅ База данных успешно создана!`n" -ForegroundColor Green
            } elseif ($createResult -match "EXISTS") {
                Write-Host "⚠️  База данных уже существует`n" -ForegroundColor Yellow
            } else {
                Write-Host "⚠️  Не удалось создать базу данных автоматически`n" -ForegroundColor Yellow
                Write-Host "   Попробуйте создать вручную через pgAdmin`n" -ForegroundColor Yellow
            }
            
            Write-Host "🚀 Теперь запустите:" -ForegroundColor Cyan
            Write-Host "   npx prisma db push`n" -ForegroundColor White
            
            exit 0
        } else {
            Write-Host " ❌" -ForegroundColor Red
        }
    } catch {
        Write-Host " ❌" -ForegroundColor Red
    }
}

Write-Host "`n❌ Не удалось найти рабочий пароль среди стандартных`n" -ForegroundColor Red
Write-Host "💡 Варианты решения:" -ForegroundColor Yellow
Write-Host "   1. Откройте pgAdmin и посмотрите сохраненный пароль" -ForegroundColor White
Write-Host "   2. Создайте базу данных через pgAdmin вручную" -ForegroundColor White
Write-Host "   3. Сбросьте пароль PostgreSQL (требуются права администратора)`n" -ForegroundColor White

