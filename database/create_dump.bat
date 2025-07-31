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

echo 🔍 Проверка pg_dump...
pg_dump --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: pg_dump не найден в системе
    echo Убедитесь, что PostgreSQL установлен и добавлен в PATH
    pause
    exit /b 1
)

echo ✅ pg_dump найден
echo 📦 Создание дампа локальной БД...
    
pg_dump -h %HOST% -p %PORT% -U %USERNAME% -d %DATABASE% --no-owner --no-privileges --clean --if-exists > init.sql
    
if !errorlevel! equ 0 (
    echo ✅ Дамп успешно создан: init.sql
) else (
    echo ❌ ОШИБКА при создании дампа
    echo.
    echo 💡 Возможные причины:
    echo 1. Неверные параметры подключения
    echo 2. PostgreSQL не запущен
    echo 3. Нет прав доступа к базе данных
    echo 4. Неправильный пароль
)

echo.
echo 📋 Команда для восстановления дампа:
echo psql -h %HOST% -p %PORT% -U %USERNAME% -d %DATABASE% ^< init.sql
echo.

pause