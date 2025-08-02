@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
echo ==========================================
echo   🐳 Запуск проекта Antrakt в Docker
echo ==========================================

REM Проверка Docker
echo 🔍 Проверка Docker...
docker --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Docker не найден
    echo Установите Docker Desktop и перезапустите скрипт
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Docker Compose не найден
    echo Установите Docker Desktop с поддержкой Compose
    pause
    exit /b 1
)

echo ✅ Docker найден

REM Проверка .env файла
if not exist ".env" (
    echo ⚠️  Файл .env не найден
    if exist ".env.example" (
        echo 📋 Копирую .env.example в .env...
        copy .env.example .env >nul
        echo ✅ Файл .env создан из шаблона
        echo.
        echo ⚠️  ВАЖНО: Отредактируйте .env файл перед продолжением!
        echo Измените пароли и секретные ключи для безопасности.
        echo.
        set /p continue="Продолжить? (y/N): "
        if /i not "!continue!"=="y" (
            echo Настройте .env и запустите скрипт снова
            pause
            exit /b 0
        )
    ) else (
        echo ❌ ОШИБКА: Нет файла .env.example для копирования
        pause
        exit /b 1
    )
)

echo ✅ Файл .env найден

REM Проверка дампа базы данных
if exist "database\init.sql" (
    echo ✅ Найден дамп базы данных: database\init.sql
) else (
    echo ℹ️  Дамп базы данных не найден
    echo База будет создана пустой
    echo.
    echo Если нужно создать дамп из существующей БД:
    echo 1. Локальная БД: cd database ^&^& create_dump.bat
    echo 2. Docker БД: cd database ^&^& create_dump_docker.bat
    echo.
)

echo.
echo 🏗️  Выберите действие:
echo 1. Сборка и запуск (полная пересборка)
echo 2. Быстрый запуск (если уже собрано)
echo 3. Только сборка
echo 4. Остановка всех сервисов
echo 5. Просмотр логов
echo 6. Статус сервисов
echo 7. Выход
echo.

set /p choice="Введите номер (1-7): "

if "%choice%"=="1" goto build_and_run
if "%choice%"=="2" goto quick_start
if "%choice%"=="3" goto build_only
if "%choice%"=="4" goto stop_services
if "%choice%"=="5" goto show_logs
if "%choice%"=="6" goto show_status
if "%choice%"=="7" goto exit_script

echo ❌ Неверный выбор
pause
exit /b 1

:build_and_run
echo.
echo 🏗️  Сборка и запуск всех сервисов...
echo Это может занять несколько минут при первом запуске
echo.
docker-compose build --no-cache
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА при сборке
    pause
    exit /b 1
)
docker-compose up -d
goto check_services

:quick_start
echo.
echo 🚀 Быстрый запуск сервисов...
docker-compose up -d
goto check_services

:build_only
echo.
echo 🏗️  Сборка образов...
docker-compose build
if !errorlevel! equ 0 (
    echo ✅ Сборка завершена успешно
) else (
    echo ❌ ОШИБКА при сборке
)
pause
exit /b 0

:stop_services
echo.
echo 🛑 Остановка всех сервисов...
docker-compose down
echo ✅ Все сервисы остановлены
pause
exit /b 0

:show_logs
echo.
echo 📋 Логи сервисов (Ctrl+C для выхода):
docker-compose logs -f
pause
exit /b 0

:show_status
echo.
echo 📊 Статус сервисов:
docker-compose ps
echo.
pause
exit /b 0

:check_services
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА при запуске
    echo.
    echo 📋 Проверьте логи:
    docker-compose logs
    pause
    exit /b 1
)

echo.
echo ⏳ Ожидание запуска сервисов...
timeout /t 10 /nobreak >nul

echo.
echo 📊 Статус сервисов:
docker-compose ps

echo.
echo 🎯 Доступ к сервисам:
echo - Фронтенд:     http://localhost:3000
echo - Бэкенд API:   http://localhost:8000
echo - MinIO Console: http://localhost:9001
echo - PostgreSQL:   localhost:5432
echo.

echo ✅ Проект запущен успешно!
echo.
echo 📝 Полезные команды:
echo - Просмотр логов: docker-compose logs -f
echo - Остановка: docker-compose down
echo - Перезапуск: docker-compose restart [service]
echo.

set /p open_browser="Открыть фронтенд в браузере? (y/N): "
if /i "!open_browser!"=="y" (
    start http://localhost:3000
)

pause
exit /b 0

:exit_script
echo До свидания! 👋
exit /b 0