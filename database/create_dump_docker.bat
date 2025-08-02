@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
echo ========================================
echo   Создание дампа базы данных (Docker)
echo ========================================

REM Параметры по умолчанию
set CONTAINER_NAME=%1
set DATABASE=%2
set USERNAME=%3
set OUTPUT_FILE=%4

if "%CONTAINER_NAME%"=="" set CONTAINER_NAME=postgres
if "%DATABASE%"=="" set DATABASE=antrakt
if "%USERNAME%"=="" set USERNAME=postgres
if "%OUTPUT_FILE%"=="" set OUTPUT_FILE=init.sql

echo 📋 Параметры:
echo Container: %CONTAINER_NAME%
echo Database: %DATABASE%
echo Username: %USERNAME%
echo Output file: %OUTPUT_FILE%
echo.

echo 🔍 Проверка Docker...
docker --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Docker не найден в системе
    echo Убедитесь, что Docker Desktop установлен и запущен
    pause
    exit /b 1
)

echo ✅ Docker найден
echo 🔍 Проверка контейнера PostgreSQL...

docker ps --filter "name=%CONTAINER_NAME%" --format "table {{.Names}}\t{{.Status}}" | findstr %CONTAINER_NAME% >nul
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Контейнер %CONTAINER_NAME% не найден или не запущен
    echo.
    echo 💡 Доступные контейнеры:
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo.
    echo Запустите контейнер командой: docker-compose up -d postgres
    pause
    exit /b 1
)

echo ✅ Контейнер %CONTAINER_NAME% найден и запущен
echo 📦 Создание дампа базы данных...

REM Создаем дамп из контейнера
docker exec -t %CONTAINER_NAME% pg_dump -U %USERNAME% -d %DATABASE% --no-owner --no-privileges --clean --if-exists > %OUTPUT_FILE%

if !errorlevel! equ 0 (
    echo ✅ Дамп успешно создан: %OUTPUT_FILE%
    
    REM Проверяем размер файла
    for %%A in (%OUTPUT_FILE%) do set filesize=%%~zA
    if !filesize! gtr 0 (
        echo 📊 Размер файла: !filesize! байт
    ) else (
        echo ⚠️  ВНИМАНИЕ: Файл дампа пустой или очень маленький
    )
) else (
    echo ❌ ОШИБКА при создании дампа
    echo.
    echo 💡 Возможные причины:
    echo 1. Контейнер не содержит указанную базу данных
    echo 2. Неверное имя пользователя
    echo 3. Нет прав доступа к базе данных
    echo 4. База данных пуста
)

echo.
echo 📋 Команды для работы с дампом:
echo Восстановление в локальный PostgreSQL:
echo psql -h localhost -p 5432 -U %USERNAME% -d %DATABASE% ^< %OUTPUT_FILE%
echo.
echo Восстановление в Docker контейнер:
echo docker exec -i %CONTAINER_NAME% psql -U %USERNAME% -d %DATABASE% ^< %OUTPUT_FILE%
echo.
echo 🚀 Для использования дампа в docker-compose поместите файл %OUTPUT_FILE% в папку database/
echo.

pause