#!/bin/bash

echo "Останавливаем все контейнеры..."
docker-compose down

echo "Удаляем volume с данными PostgreSQL для полной очистки..."
docker volume rm $(docker-compose config --volumes | grep postgres_data) 2>/dev/null || echo "Volume postgres_data не найден или уже удален"

echo "Пересобираем образы..."
docker-compose build --no-cache

echo "Запускаем сервисы..."
docker-compose up -d

echo "Проверяем статус сервисов..."
docker-compose ps

echo "Готово! База данных будет инициализирована из init.sql"
echo "Для просмотра логов используйте: docker-compose logs -f postgres"