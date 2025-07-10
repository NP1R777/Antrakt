# Театральная студия "Антракт" - PowerShell скрипт запуска
Write-Host "========================================" -ForegroundColor Green
Write-Host "Театральная студия 'Антракт' - Запуск" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Проверка наличия Docker
try {
    docker --version | Out-Null
    Write-Host "✓ Docker найден" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker не найден. Установите Docker Desktop для Windows" -ForegroundColor Red
    exit 1
}

# Проверка наличия Python
try {
    python --version | Out-Null
    Write-Host "✓ Python найден" -ForegroundColor Green
} catch {
    Write-Host "✗ Python не найден. Установите Python 3.8+" -ForegroundColor Red
    exit 1
}

Write-Host "`n1. Запуск PostgreSQL и MinIO через Docker..." -ForegroundColor Yellow
docker-compose up -d postgres minio

Write-Host "`n2. Ожидание запуска сервисов..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Проверка статуса сервисов
Write-Host "`n3. Проверка статуса сервисов..." -ForegroundColor Yellow
$postgresStatus = docker-compose ps postgres
$minioStatus = docker-compose ps minio

if ($postgresStatus -match "Up") {
    Write-Host "✓ PostgreSQL запущен" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL не запущен" -ForegroundColor Red
}

if ($minioStatus -match "Up") {
    Write-Host "✓ MinIO запущен" -ForegroundColor Green
} else {
    Write-Host "✗ MinIO не запущен" -ForegroundColor Red
}

Write-Host "`n4. Настройка виртуального окружения..." -ForegroundColor Yellow
# Set-Location backend

# if (-not (Test-Path "venv\Scripts\Activate.ps1")) {
#     Write-Host "Создание виртуального окружения..." -ForegroundColor Yellow
#     python -m venv venv
# }

Write-Host "Активация виртуального окружения..." -ForegroundColor Yellow
& ".\env\Scripts\activate"

# Write-Host "`n5. Установка зависимостей..." -ForegroundColor Yellow
# pip install -r requirements.txt

Write-Host "`n6. Применение миграций..." -ForegroundColor Yellow
Set-Location backend
python app\manage.py migrate

Write-Host "`n7. Инициализация MinIO..." -ForegroundColor Yellow
python init_minio.py

Write-Host "`n8. Запуск Django сервера..." -ForegroundColor Yellow
Write-Host "`nДоступные сервисы:" -ForegroundColor Cyan
Write-Host "• Django API: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "• MinIO Console: http://127.0.0.1:9001" -ForegroundColor White
Write-Host "  Логин: minioadmin, Пароль: minioadmin123" -ForegroundColor Gray
Write-Host "• Swagger API Docs: http://127.0.0.1:8000/swagger/" -ForegroundColor White
Write-Host "`nДля остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

python app\manage.py runserver