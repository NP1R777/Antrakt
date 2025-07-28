@echo off
echo ================================
echo   Просмотр логов ANTRAKT
echo ================================

REM Проверка наличия Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Docker Compose не найден
    pause
    exit /b 1
)

echo.
echo Выберите сервис для просмотра логов:
echo 1. Все сервисы
echo 2. Backend (Django)
echo 3. Frontend (React/Nginx)
echo 4. PostgreSQL
echo 5. MinIO
echo 0. Выход
echo.

set /p choice="Введите номер (0-5): "

if "%choice%"=="1" (
    echo Показ логов всех сервисов...
    docker-compose logs -f
) else if "%choice%"=="2" (
    echo Показ логов Backend...
    docker-compose logs -f backend
) else if "%choice%"=="3" (
    echo Показ логов Frontend...
    docker-compose logs -f frontend
) else if "%choice%"=="4" (
    echo Показ логов PostgreSQL...
    docker-compose logs -f postgres
) else if "%choice%"=="5" (
    echo Показ логов MinIO...
    docker-compose logs -f minio
) else if "%choice%"=="0" (
    echo Выход...
    exit /b 0
) else (
    echo Неверный выбор
    pause
    goto :eof
)

echo.
echo Нажмите Ctrl+C для выхода из просмотра логов
pause