#!/bin/bash

set -e

echo "=== Исправление проблем с Docker ==="

# Остановка всех контейнеров
echo "Остановка всех контейнеров..."
docker-compose down --remove-orphans || true

# Очистка Docker системы
echo "Очистка Docker системы..."
docker system prune -f
docker builder prune -f

# Удаление старых образов проекта
echo "Удаление старых образов..."
docker images | grep -E "(workspace|antrakt)" | awk '{print $3}' | xargs -r docker rmi -f || true

# Проверка доступности интернета
echo "Проверка подключения к интернету..."
if ! curl -s --max-time 10 https://www.google.com > /dev/null; then
    echo "ОШИБКА: Нет подключения к интернету!"
    exit 1
fi

# Проверка доступности Docker Hub
echo "Проверка доступности Docker Hub..."
if ! curl -s --max-time 10 https://hub.docker.com > /dev/null; then
    echo "ПРЕДУПРЕЖДЕНИЕ: Docker Hub может быть недоступен"
fi

# Сборка с подробным выводом
echo "Запуск сборки контейнеров..."
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Сборка backend отдельно для лучшего контроля
echo "Сборка backend..."
docker-compose build --no-cache --progress=plain backend

# Сборка frontend
echo "Сборка frontend..."
docker-compose build --no-cache --progress=plain frontend

# Запуск всех сервисов
echo "Запуск всех сервисов..."
docker-compose up -d

# Проверка статуса
echo "Проверка статуса контейнеров..."
docker-compose ps

echo "=== Запуск завершен ==="
echo "Проверьте логи командой: docker-compose logs -f"