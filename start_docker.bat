@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
echo ================================
echo   ANTRAKT Docker Setup
echo ================================

REM Проверка наличия Docker
echo [1/15] Проверка Docker...
docker --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Docker не установлен или не запущен
    echo Пожалуйста, установите Docker Desktop и запустите его
    pause
    exit /b 1
)
echo ✅ Docker найден

REM Проверка наличия Docker Compose
echo [2/15] Проверка Docker Compose...
docker compose version >nul 2>&1
if !errorlevel! neq 0 (
    docker-compose --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo ❌ ОШИБКА: Docker Compose не найден
        echo Убедитесь, что Docker Desktop включает Docker Compose
        pause
        exit /b 1
    )
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)
echo ✅ Docker Compose найден

REM Проверка файлов конфигурации
echo [3/15] Проверка конфигурационных файлов...
if not exist "docker-compose.yml" (
    echo ❌ ОШИБКА: Файл docker-compose.yml не найден
    pause
    exit /b 1
)
if not exist "database\init.sql" (
    echo ⚠️  ПРЕДУПРЕЖДЕНИЕ: Файл database\init.sql не найден
    echo Создаю базовый init.sql файл...
    if not exist "database" mkdir database
    echo -- Базовая инициализация PostgreSQL > database\init.sql
    echo CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; >> database\init.sql
)
echo ✅ Конфигурационные файлы проверены

REM Остановка существующих контейнеров
echo [4/15] Остановка существующих контейнеров...
!COMPOSE_CMD! down --remove-orphans >nul 2>&1
if !errorlevel! neq 0 (
    echo ⚠️  Предупреждение: Ошибка при остановке контейнеров (возможно, они не были запущены)
) else (
    echo ✅ Существующие контейнеры остановлены
)

REM Очистка неиспользуемых ресурсов
echo [5/15] Очистка неиспользуемых ресурсов...
docker system prune -f >nul 2>&1
echo ✅ Очистка завершена

REM Сборка образов
echo [6/15] Сборка образов...
echo Это может занять несколько минут при первом запуске...
!COMPOSE_CMD! build --no-cache
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Не удалось собрать образы
    echo Проверьте Dockerfile'ы и зависимости
    echo Просмотрите логи выше для диагностики
    pause
    exit /b 1
)
echo ✅ Образы собраны

REM Создание сети (если не существует)
echo [7/15] Создание сети...
docker network create antrakt_network >nul 2>&1
echo ✅ Сеть готова

REM Запуск PostgreSQL
echo [8/15] Запуск PostgreSQL...
!COMPOSE_CMD! up -d postgres
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Не удалось запустить PostgreSQL
    pause
    exit /b 1
)
echo ✅ PostgreSQL запущен

REM Ожидание готовности PostgreSQL
echo [9/15] Ожидание готовности PostgreSQL...
set /a counter=0
:wait_postgres
timeout /t 5 /nobreak >nul
!COMPOSE_CMD! exec -T postgres pg_isready -U postgres >nul 2>&1
if !errorlevel! neq 0 (
    set /a counter+=1
    if !counter! lss 12 (
        echo ⏳ PostgreSQL еще не готов, ждем... (!counter!/12)
        goto wait_postgres
    ) else (
        echo ⚠️  PostgreSQL долго не готов, продолжаем...
    )
) else (
    echo ✅ PostgreSQL готов
)

REM Запуск MinIO
echo [10/15] Запуск MinIO...
!COMPOSE_CMD! up -d minio
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Не удалось запустить MinIO
    pause
    exit /b 1
)
echo ✅ MinIO запущен

REM Ожидание готовности MinIO
echo [11/15] Ожидание готовности MinIO...
timeout /t 15 /nobreak >nul
echo ✅ MinIO готов

REM Запуск Backend
echo [12/15] Запуск Backend...
echo Это может занять время для применения миграций...
!COMPOSE_CMD! up -d backend
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Не удалось запустить Backend
    echo Проверьте логи: !COMPOSE_CMD! logs backend
    pause
    exit /b 1
)
echo ✅ Backend запущен

REM Ожидание готовности Backend
echo [13/15] Ожидание готовности Backend...
timeout /t 30 /nobreak >nul
echo ✅ Backend готов

REM Запуск Frontend
echo [14/15] Запуск Frontend...
!COMPOSE_CMD! up -d frontend
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Не удалось запустить Frontend
    echo Проверьте логи: !COMPOSE_CMD! logs frontend
    pause
    exit /b 1
)
echo ✅ Frontend запущен

REM Финальная проверка
echo [15/15] Финальная проверка...
!COMPOSE_CMD! ps

echo.
echo ================================
echo   🎉 Контейнеры успешно запущены!
echo ================================
echo.
echo 🌐 Доступные сервисы:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - MinIO Console: http://localhost:9001
echo - PostgreSQL: localhost:5432
echo.
echo 🔧 Полезные команды:
echo - Просмотр логов: !COMPOSE_CMD! logs -f [service_name]
echo - Остановка: !COMPOSE_CMD! down
echo - Перезапуск: !COMPOSE_CMD! restart [service_name]
echo - Статус: !COMPOSE_CMD! ps
echo.

pause