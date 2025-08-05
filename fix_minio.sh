#!/bin/bash

echo "🔧 Скрипт для решения проблемы с MinIO"
echo "====================================="

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и повторите попытку."
    exit 1
fi

echo "✅ Docker найден"

# Проверяем наличие docker-compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose не найден. Установите Docker Compose и повторите попытку."
    exit 1
fi

echo "✅ Docker Compose найден: $COMPOSE_CMD"

# Останавливаем существующие контейнеры
echo ""
echo "🛑 Остановка существующих контейнеров..."
$COMPOSE_CMD down

# Удаляем старые volumes (опционально)
read -p "🗑️  Удалить старые данные MinIO? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Удаление старых volumes..."
    docker volume rm minio_data 2>/dev/null || true
fi

# Запускаем только MinIO
echo ""
echo "🚀 Запуск MinIO..."
$COMPOSE_CMD up -d minio

# Ждем запуска MinIO
echo "⏳ Ожидание запуска MinIO..."
sleep 10

# Проверяем статус
echo ""
echo "📊 Проверка статуса MinIO..."
if $COMPOSE_CMD ps minio | grep -q "Up"; then
    echo "✅ MinIO запущен успешно!"
    
    # Инициализируем bucket
    echo ""
    echo "🪣 Инициализация bucket..."
    cd backend
    if python3 init_minio.py; then
        echo "✅ Bucket инициализирован успешно!"
    else
        echo "⚠️  Ошибка при инициализации bucket. Попробуйте позже."
    fi
    cd ..
    
    echo ""
    echo "🎉 MinIO готов к работе!"
    echo "📍 MinIO Console: http://localhost:9001"
    echo "🔑 Логин: minioadmin"
    echo "🔑 Пароль: minioadmin123"
    
    # Проверяем доступность
    echo ""
    echo "🔍 Финальная проверка..."
    cd backend
    python3 simple_diagnose.py
    cd ..
    
else
    echo "❌ Ошибка при запуске MinIO"
    echo "📋 Логи MinIO:"
    $COMPOSE_CMD logs minio
    exit 1
fi

echo ""
echo "✨ Готово! Теперь загрузка файлов должна работать."