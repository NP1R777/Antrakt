# Быстрый запуск только Django сервера
Write-Host "========================================" -ForegroundColor Green
Write-Host "Запуск Django сервера" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Проверяем, есть ли уже активированное виртуальное окружение
if (-not $env:VIRTUAL_ENV) {
    Write-Host "⚠ Виртуальное окружение не активировано" -ForegroundColor Yellow
    Write-Host "Активируйте виртуальное окружение перед запуском" -ForegroundColor Yellow
    Write-Host "Пример: venv\Scripts\Activate.ps1" -ForegroundColor Cyan
    exit 1
}

Write-Host "✓ Виртуальное окружение активировано: $env:VIRTUAL_ENV" -ForegroundColor Green

# Проверяем, запущены ли Docker сервисы
Write-Host "`nПроверка Docker сервисов..." -ForegroundColor Yellow
$postgresStatus = docker-compose ps postgres 2>$null
$minioStatus = docker-compose ps minio 2>$null

if ($postgresStatus -match "Up") {
    Write-Host "✓ PostgreSQL запущен" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL не запущен" -ForegroundColor Yellow
    Write-Host "Запустите: docker-compose up -d postgres" -ForegroundColor Cyan
}

if ($minioStatus -match "Up") {
    Write-Host "✓ MinIO запущен" -ForegroundColor Green
} else {
    Write-Host "⚠ MinIO не запущен" -ForegroundColor Yellow
    Write-Host "Запустите: docker-compose up -d minio" -ForegroundColor Cyan
}

Set-Location backend

Write-Host "`nЗапуск Django сервера..." -ForegroundColor Yellow
Write-Host "Django будет доступен по адресу: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

python app\manage.py runserver