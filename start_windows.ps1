# Театральная студия "Антракт" - PowerShell скрипт запуска
Write-Host "========================================" -ForegroundColor Green
Write-Host "Театральная студия 'Антракт' - Запуск" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Проверка наличия PostgreSQL и MinIO
Write-Host "Убедитесь, что PostgreSQL и MinIO запущены локально:" -ForegroundColor Yellow
Write-Host "• PostgreSQL на порту 5432" -ForegroundColor White
Write-Host "• MinIO на портах 9000 и 9001" -ForegroundColor White

# Проверка наличия Python
try {
    python --version | Out-Null
    Write-Host "✓ Python найден" -ForegroundColor Green
} catch {
    Write-Host "✗ Python не найден. Установите Python 3.8+" -ForegroundColor Red
    exit 1
}

Write-Host "`n1. Проверка подключения к сервисам..." -ForegroundColor Yellow
Write-Host "Примечание: PostgreSQL и MinIO должны быть запущены отдельно" -ForegroundColor Gray

Write-Host "`n2. Настройка виртуального окружения..." -ForegroundColor Yellow
# Set-Location backend

# if (-not (Test-Path "venv\Scripts\Activate.ps1")) {
#     Write-Host "Создание виртуального окружения..." -ForegroundColor Yellow
#     python -m venv venv
# }

Write-Host "Активация виртуального окружения..." -ForegroundColor Yellow
& ".\env\Scripts\activate"

# Write-Host "`n5. Установка зависимостей..." -ForegroundColor Yellow
# pip install -r requirements.txt

Write-Host "`n3. Применение миграций..." -ForegroundColor Yellow
Set-Location backend
python app\manage.py migrate

Write-Host "`n4. Инициализация MinIO..." -ForegroundColor Yellow
python init_minio.py

Write-Host "`n5. Запуск Django сервера..." -ForegroundColor Yellow
Write-Host "`nДоступные сервисы:" -ForegroundColor Cyan
Write-Host "• Django API: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "• MinIO Console: http://127.0.0.1:9001" -ForegroundColor White
Write-Host "  Логин: minioadmin, Пароль: minioadmin123" -ForegroundColor Gray
Write-Host "• Swagger API Docs: http://127.0.0.1:8000/swagger/" -ForegroundColor White
Write-Host "`nДля остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

python app\manage.py runserver