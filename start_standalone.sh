#!/bin/bash

echo "========================================"
echo "Театральная студия 'Антракт' - Автономный запуск"
echo "========================================"

echo ""
echo "АВТОНОМНЫЙ РЕЖИМ - БЕЗ ОЖИДАНИЯ DOCKER КОНТЕЙНЕРОВ"
echo ""
echo "Приложение может работать:"
echo "• С PostgreSQL (если доступен) или SQLite (fallback)"
echo "• С MinIO (если доступен) или локальное хранение (fallback)"
echo ""

# Проверка наличия Python
if ! command -v python3 &> /dev/null; then
    echo "✗ Python3 не найден. Установите Python 3.8+"
    exit 1
fi

echo "✓ Python найден"

echo ""
echo "1. Настройка виртуального окружения..."
cd backend

if [ ! -d "venv" ]; then
    echo "Создание виртуального окружения..."
    python3 -m venv venv
fi

echo "Активация виртуального окружения..."
source venv/bin/activate

echo ""
echo "2. Установка зависимостей..."
pip install -r requirements.txt

echo ""
echo "3. Применение миграций..."
echo "(Будет использована доступная БД: PostgreSQL или SQLite)"
python app/manage.py migrate

echo ""
echo "4. Проверка MinIO (без ожидания)..."
python init_minio.py

echo ""
echo "5. Запуск Django сервера..."
echo ""
echo "Доступные сервисы:"
echo "• Django API: http://127.0.0.1:8000"
echo "• Swagger API Docs: http://127.0.0.1:8000/swagger/"
echo ""
echo "Опциональные сервисы (если запущены):"
echo "• MinIO Console: http://127.0.0.1:9001"
echo "  Логин: minioadmin, Пароль: minioadmin123"
echo "• PostgreSQL: localhost:5432"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo "========================================"

python app/manage.py runserver