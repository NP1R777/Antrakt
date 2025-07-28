@echo off
echo ================================
echo   Остановка ANTRAKT контейнеров
echo ================================

REM Проверка наличия Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Docker Compose не найден
    pause
    exit /b 1
)

echo Остановка всех контейнеров...
docker-compose down

if %errorlevel% equ 0 (
    echo.
    echo ================================
    echo   Контейнеры успешно остановлены
    echo ================================
    echo.
    echo Для полного удаления данных используйте:
    echo docker-compose down -v
    echo.
    echo Для просмотра статуса: docker-compose ps
    echo.
) else (
    echo.
    echo ОШИБКА при остановке контейнеров
    echo Проверьте логи: docker-compose logs
)

pause