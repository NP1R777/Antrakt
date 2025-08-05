# Театральная студия "Антракт" - PowerShell автономный запуск
Write-Host "========================================" -ForegroundColor Green
Write-Host "Театральная студия 'Антракт' - Автономный запуск" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nАВТОНОМНЫЙ РЕЖИМ - БЕЗ ОЖИДАНИЯ DOCKER КОНТЕЙНЕРОВ" -ForegroundColor Yellow
Write-Host "`nПриложение может работать:" -ForegroundColor Cyan
Write-Host "• С PostgreSQL (если доступен) или SQLite (fallback)" -ForegroundColor White
Write-Host "• С MinIO (если доступен) или локальное хранение (fallback)" -ForegroundColor White

# Проверка наличия Python
try {
    python --version | Out-Null
    Write-Host "`n✓ Python найден" -ForegroundColor Green
} catch {
    Write-Host "`n✗ Python не найден. Установите Python 3.8+" -ForegroundColor Red
    exit 1
}

Write-Host "`n1. Настройка виртуального окружения..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host "Создание виртуального окружения..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "Активация виртуального окружения..." -ForegroundColor Yellow
& ".\venv\Scripts\activate"

Write-Host "`n2. Установка зависимостей..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "`n3. Применение миграций..." -ForegroundColor Yellow
Write-Host "(Будет использована доступная БД: PostgreSQL или SQLite)" -ForegroundColor Gray
python app\manage.py migrate

Write-Host "`n4. Проверка MinIO (без ожидания)..." -ForegroundColor Yellow
python init_minio.py

Write-Host "`n5. Запуск Django сервера..." -ForegroundColor Yellow
Write-Host "`nДоступные сервисы:" -ForegroundColor Cyan
Write-Host "• Django API: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "• Swagger API Docs: http://127.0.0.1:8000/swagger/" -ForegroundColor White

Write-Host "`nОпциональные сервисы (если запущены):" -ForegroundColor Cyan
Write-Host "• MinIO Console: http://127.0.0.1:9001" -ForegroundColor White
Write-Host "  Логин: minioadmin, Пароль: minioadmin123" -ForegroundColor Gray
Write-Host "• PostgreSQL: localhost:5432" -ForegroundColor White

Write-Host "`nДля остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

python app\manage.py runserver