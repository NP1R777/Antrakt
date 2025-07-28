@echo off
echo ================================
echo   ANTRAKT Docker Setup
echo ================================

REM Проверка наличия Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Docker не установлен или не запущен
    echo Пожалуйста, установите Docker Desktop и запустите его
    pause
    exit /b 1
)

REM Проверка наличия Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Docker Compose не найден
    echo Убедитесь, что Docker Desktop включает Docker Compose
    pause
    exit /b 1
)

echo Docker найден. Запуск контейнеров...
echo.

REM Остановка существующих контейнеров
echo Остановка существующих контейнеров...
docker-compose down

REM Сборка и запуск контейнеров
echo Сборка и запуск контейнеров...
docker-compose up --build -d

if %errorlevel% equ 0 (
    echo.
    echo ================================
    echo   Контейнеры успешно запущены!
    echo ================================
    echo.
    echo Доступные сервисы:
    echo - Frontend: http://localhost:3000
    echo - Backend API: http://localhost:8000
    echo - MinIO Console: http://localhost:9001
    echo - PostgreSQL: localhost:5432
    echo.
    echo Для просмотра логов: docker-compose logs -f
    echo Для остановки: docker-compose down
    echo.
) else (
    echo.
    echo ОШИБКА при запуске контейнеров
    echo Проверьте логи: docker-compose logs
)

pause