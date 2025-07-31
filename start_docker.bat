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

REM Улучшенная проверка init.sql
if exist "database\init.sql" (
    echo ✅ Файл init.sql найден
    echo Проверка содержимого init.sql...
    findstr /C:"CREATE" database\init.sql >nul
    if !errorlevel! neq 0 (
        echo ⚠️  ВНИМАНИЕ: Файл init.sql не содержит SQL-команд!
        echo Возможно, файл пустой или поврежден
        echo Создаю новый init.sql с базовым содержимым...
        echo -- Базовая инициализация PostgreSQL > database\init.sql
        echo CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; >> database\init.sql
    )
) else (
    echo ⚠️  ПРЕДУПРЕЖДЕНИЕ: Файл database\init.sql не найден
    echo Создаю базовый init.sql файл...
    if not exist "database" mkdir database
    echo -- Базовая инициализация PostgreSQL > database\init.sql
    echo CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; >> database\init.sql
    echo ✅ Файл init.sql создан
)

REM Остановка существующих контейнеров
echo [4/15] Остановка существующих контейнеров...
!COMPOSE_CMD! down --remove-orphans
if !errorlevel! neq 0 (
    echo ⚠️  Предупреждение: Ошибка при остановке контейнеров
    echo Продолжаем выполнение...
)

REM Очистка неиспользуемых ресурсов
echo [5/15] Очистка неиспользуемых ресурсов...
docker system prune -f
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
docker network create antrakt_network >nul 2>&1 || echo ⚠️  Сеть уже существует или не может быть создана
echo ✅ Сеть готова

REM Запуск PostgreSQL с диагностикой
echo [8/15] Запуск PostgreSQL...
!COMPOSE_CMD! up -d postgres
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Не удалось запустить PostgreSQL
    echo Логи PostgreSQL:
    !COMPOSE_CMD! logs postgres
    pause
    exit /b 1
)
echo ✅ PostgreSQL запущен

REM Улучшенное ожидание готовности PostgreSQL
echo [9/15] Ожидание готовности PostgreSQL...
set /a counter=0
:wait_postgres
timeout /t 5 /nobreak >nul
docker exec -i antrakt-postgres-1 pg_isready -U postgres >nul 2>&1
if !errorlevel! neq 0 (
    set /a counter+=1
    echo ⏳ Ожидание PostgreSQL... (попытка !counter!/30)
    if !counter! geq 30 (
        echo ❌ ОШИБКА: PostgreSQL не запустился за 150 секунд
        echo Логи PostgreSQL:
        !COMPOSE_CMD! logs postgres
        echo Проверка состояния контейнера:
        docker ps -a | findstr postgres
        echo Попробуйте запустить вручную: docker start antrakt-postgres-1
        pause
        exit /b 1
    )
    goto wait_postgres
)
echo ✅ PostgreSQL готов

REM Проверка применения init.sql
echo Проверка инициализации базы данных...
docker exec -i antrakt-postgres-1 psql -U postgres -d antrakt -c "SELECT '✅ База данных успешно проинициализирована' AS status;" || (
    echo ❌ ОШИБКА: Не удалось подключиться к базе данных
    echo Проверьте файл init.sql и логи PostgreSQL
    !COMPOSE_CMD! logs postgres
    pause
    exit /b 1
)

REM Запуск MinIO с диагностикой
echo [10/15] Запуск MinIO...
!COMPOSE_CMD! up -d minio
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Не удалось запустить MinIO
    echo Логи MinIO:
    !COMPOSE_CMD! logs minio
    pause
    exit /b 1
)
echo ✅ MinIO запущен

REM Ожидание готовности MinIO
echo [11/15] Ожидание готовности MinIO...
timeout /t 30 /nobreak >nul
echo ✅ MinIO готов

REM Запуск Backend с диагностикой
echo [12/15] Запуск Backend...
echo Это может занять время для применения миграций...
!COMPOSE_CMD! up -d backend
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Не удалось запустить Backend
    echo Логи Backend:
    !COMPOSE_CMD! logs backend
    pause
    exit /b 1
)
echo ✅ Backend запущен

REM Улучшенное ожидание готовности Backend
echo [13/15] Ожидание готовности Backend...
set /a counter=0
:wait_backend
curl -s http://localhost:8000/healthcheck >nul 2>&1
if !errorlevel! neq 0 (
    set /a counter+=1
    echo ⏳ Ожидание Backend... (попытка !counter!/30)
    if !counter! geq 30 (
        echo ❌ ОШИБКА: Backend не запустился за 150 секунд
        echo Логи Backend:
        !COMPOSE_CMD! logs backend
        pause
        exit /b 1
    )
    timeout /t 5 /nobreak >nul
    goto wait_backend
)
echo ✅ Backend готов

REM Запуск Frontend
echo [14/15] Запуск Frontend...
!COMPOSE_CMD! up -d frontend
if !errorlevel! neq 0 (
    echo ❌ ОШИБКА: Не удалось запустить Frontend
    echo Логи Frontend:
    !COMPOSE_CMD! logs frontend
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

REM Дополнительная диагностика
echo ⚠️  Если сервисы не работают, проверьте:
echo 1. Логи PostgreSQL: !COMPOSE_CMD! logs postgres
echo 2. Состояние базы данных: docker exec -it antrakt-postgres-1 psql -U postgres -d antrakt
echo 3. Проверьте init.sql: type database\init.sql
echo.

pause