#!/bin/bash

# Скрипт для создания дампа локальной базы данных PostgreSQL
# Использование: ./create_dump.sh [host] [port] [database] [username]

# Параметры по умолчанию (можно изменить)
HOST=${1:-localhost}
PORT=${2:-5432}
DATABASE=${3:-antrakt}
USERNAME=${4:-postgres}

echo "Создание дампа базы данных..."
echo "Host: $HOST"
echo "Port: $PORT"
echo "Database: $DATABASE"
echo "Username: $USERNAME"

# Создание дампа
pg_dump -h $HOST -p $PORT -U $USERNAME -d $DATABASE --no-owner --no-privileges --clean --if-exists > init.sql

if [ $? -eq 0 ]; then
    echo "Дамп успешно создан: init.sql"
    echo "Файл готов для использования в проекте"
else
    echo "Ошибка при создании дампа"
    exit 1
fi