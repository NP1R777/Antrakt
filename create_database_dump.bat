@echo off
echo ================================
echo   Создание дампа базы данных
echo ================================

REM Переход в директорию database
cd /d "%~dp0database"

REM Проверка наличия pg_dump
pg_dump --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: pg_dump не найден
    echo Пожалуйста, установите PostgreSQL client tools
    echo Или добавьте путь к pg_dump в переменную PATH
    pause
    exit /b 1
)

echo.
echo Введите параметры подключения к вашей локальной базе данных:
echo (или нажмите Enter для использования значений по умолчанию)
echo.

set /p HOST="Host (по умолчанию: localhost): "
if "%HOST%"=="" set HOST=localhost

set /p PORT="Port (по умолчанию: 5432): "
if "%PORT%"=="" set PORT=5432

set /p DATABASE="Database (по умолчанию: antrakt): "
if "%DATABASE%"=="" set DATABASE=antrakt

set /p USERNAME="Username (по умолчанию: postgres): "
if "%USERNAME%"=="" set USERNAME=postgres

echo.
echo Создание дампа базы данных...
echo Host: %HOST%
echo Port: %PORT%
echo Database: %DATABASE%
echo Username: %USERNAME%
echo.

REM Создание дампа
pg_dump -h %HOST% -p %PORT% -U %USERNAME% -d %DATABASE% --no-owner --no-privileges --clean --if-exists > init.sql

if %errorlevel% equ 0 (
    echo.
    echo ================================
    echo   Дамп успешно создан!
    echo ================================
    echo.
    echo Файл: database\init.sql
    echo Размер: 
    for %%A in (init.sql) do echo %%~zA bytes
    echo.
    echo Теперь вы можете запустить Docker контейнеры с данными из вашей локальной БД
    echo Используйте: start_docker.bat
    echo.
) else (
    echo.
    echo ОШИБКА при создании дампа
    echo Проверьте параметры подключения и права доступа к базе данных
)

pause