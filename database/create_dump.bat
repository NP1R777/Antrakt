@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
echo ================================
echo   Создание дампа базы данных
echo ================================

REM Параметры по умолчанию (можно передать как аргументы)
set HOST=%1
set PORT=%2
set DATABASE=%3
set USERNAME=%4

if "%HOST%"=="" set HOST=localhost
if "%PORT%"=="" set PORT=5432
if "%DATABASE%"=="" set DATABASE=antrakt
if "%USERNAME%"=="" set USERNAME=postgres

echo 📋 Параметры подключения:
echo Host: %HOST%
echo Port: %PORT%
echo Database: %DATABASE%
echo Username: %USERNAME%
echo.

REM Проверка наличия pg_dump
echo 🔍 Проверка pg_dump...
pg_dump --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ⚠️  pg_dump не найден в системе
    echo.
    echo 🐳 Используем Docker версию:
    echo Проверяем наличие контейнера PostgreSQL...
    
    docker ps --format "table {{.Names}}" | findstr postgres >nul
    if !errorlevel! neq 0 (
        echo ❌ ОШИБКА: Контейнер PostgreSQL не запущен
        echo Запустите контейнеры командой: start_docker_fixed.bat
        pause
        exit /b 1
    )
    
    echo ✅ Контейнер PostgreSQL найден
    echo 📦 Создание дампа через Docker...
    
    REM Определяем имя контейнера PostgreSQL
    for /f "tokens=*" %%i in ('docker ps --format "{{.Names}}" ^| findstr postgres') do set POSTGRES_CONTAINER=%%i
    
    docker exec !POSTGRES_CONTAINER! pg_dump -U %USERNAME% -d %DATABASE% --no-owner --no-privileges --clean --if-exists > init.sql
    
    if !errorlevel! equ 0 (
        echo ✅ Дамп успешно создан через Docker: init.sql
        echo 📁 Файл готов для использования в Docker контейнере
    ) else (
        echo ❌ Ошибка при создании дампа через Docker
        exit /b 1
    )
) else (
    echo ✅ pg_dump найден
    echo 📦 Создание дампа...
    
    REM Создание дампа с помощью локального pg_dump
    pg_dump -h %HOST% -p %PORT% -U %USERNAME% -d %DATABASE% --no-owner --no-privileges --clean --if-exists > init.sql
    
    if !errorlevel! equ 0 (
        echo ✅ Дамп успешно создан: init.sql
        echo 📁 Файл готов для использования в Docker контейнере
    ) else (
        echo ❌ ОШИБКА при создании дампа
        echo.
        echo 💡 Возможные причины:
        echo 1. Неверные параметры подключения
        echo 2. PostgreSQL не запущен
        echo 3. Нет прав доступа к базе данных
        echo.
        echo 🔧 Попробуйте:
        echo 1. Проверить параметры подключения
        echo 2. Убедиться, что PostgreSQL запущен
        echo 3. Использовать Docker версию (если контейнеры запущены)
    )
)

echo.
echo 🔧 Альтернативные команды:
echo.
echo 📋 Для создания дампа через Docker:
echo docker exec [postgres_container] pg_dump -U postgres -d antrakt --no-owner --no-privileges --clean --if-exists ^> /tmp/dump.sql
echo docker cp [postgres_container]:/tmp/dump.sql ./init.sql
echo.
echo 📋 Для восстановления дампа:
echo psql -h %HOST% -p %PORT% -U %USERNAME% -d %DATABASE% ^< init.sql
echo.

pause