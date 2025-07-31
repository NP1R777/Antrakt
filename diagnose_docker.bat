@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
echo ================================
echo   ANTRAKT Docker Диагностика
echo ================================

echo 🔍 Проверка системы...
echo.

REM Проверка Docker
echo [1/8] Проверка Docker...
docker --version
if !errorlevel! neq 0 (
    echo ❌ Docker не установлен или недоступен
) else (
    echo ✅ Docker работает
)
echo.

REM Проверка Docker Compose
echo [2/8] Проверка Docker Compose...
docker compose version 2>nul
if !errorlevel! neq 0 (
    docker-compose --version 2>nul
    if !errorlevel! neq 0 (
        echo ❌ Docker Compose недоступен
    ) else (
        echo ✅ Docker Compose (legacy) работает
        set COMPOSE_CMD=docker-compose
    )
) else (
    echo ✅ Docker Compose работает
    set COMPOSE_CMD=docker compose
)
echo.

REM Проверка файлов
echo [3/8] Проверка файлов конфигурации...
if exist "docker-compose.yml" (
    echo ✅ docker-compose.yml найден
) else (
    echo ❌ docker-compose.yml НЕ найден
)

if exist "database\init.sql" (
    echo ✅ database\init.sql найден
) else (
    echo ⚠️  database\init.sql НЕ найден
)

if exist "backend\Dockerfile" (
    echo ✅ backend\Dockerfile найден
) else (
    echo ❌ backend\Dockerfile НЕ найден
)

if exist "frontend\antrakt\Dockerfile" (
    echo ✅ frontend\antrakt\Dockerfile найден
) else (
    echo ❌ frontend\antrakt\Dockerfile НЕ найден
)
echo.

REM Проверка контейнеров
echo [4/8] Проверка запущенных контейнеров...
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.

REM Проверка всех контейнеров
echo [5/8] Проверка всех контейнеров (включая остановленные)...
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
echo.

REM Проверка образов
echo [6/8] Проверка образов...
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo.

REM Проверка сетей
echo [7/8] Проверка сетей Docker...
docker network ls
echo.

REM Проверка томов
echo [8/8] Проверка томов Docker...
docker volume ls
echo.

echo ================================
echo   Диагностика логов
echo ================================

if defined COMPOSE_CMD (
    echo 📋 Статус сервисов:
    !COMPOSE_CMD! ps
    echo.
    
    echo 📋 Последние логи (последние 10 строк каждого сервиса):
    echo.
    
    echo --- PostgreSQL логи ---
    !COMPOSE_CMD! logs --tail=10 postgres 2>nul
    echo.
    
    echo --- MinIO логи ---
    !COMPOSE_CMD! logs --tail=10 minio 2>nul
    echo.
    
    echo --- Backend логи ---
    !COMPOSE_CMD! logs --tail=10 backend 2>nul
    echo.
    
    echo --- Frontend логи ---
    !COMPOSE_CMD! logs --tail=10 frontend 2>nul
    echo.
)

echo ================================
echo   Рекомендации
echo ================================
echo.
echo 💡 Если возникают проблемы:
echo.
echo 1. 🔄 Перезапустите Docker Desktop
echo 2. 🧹 Очистите Docker: docker system prune -a --volumes
echo 3. 🔨 Пересоберите образы: !COMPOSE_CMD! build --no-cache
echo 4. 📋 Проверьте логи: !COMPOSE_CMD! logs [service_name]
echo 5. 🔍 Используйте: start_docker_fixed.bat для пошагового запуска
echo.
echo 🆘 Для получения подробных логов:
echo !COMPOSE_CMD! logs -f [service_name]
echo.

pause