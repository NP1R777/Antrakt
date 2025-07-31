FROM python:3.11-slim

# Установка переменных окружения для неинтерактивной установки
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Установка системных зависимостей с улучшенной обработкой ошибок
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    curl \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get autoremove -y

# Установка рабочей директории
WORKDIR /app

# Копирование requirements и установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копирование скриптов инициализации
COPY init_minio.py .
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Копирование кода приложения
COPY app/ ./app/

# Создание директории для статических файлов
RUN mkdir -p /app/static /app/media

# Открытие порта
EXPOSE 8000

# Создание улучшенного скрипта запуска
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Ожидание готовности PostgreSQL..."\n\
./wait-for-it.sh postgres:5432 --timeout=60 --strict\n\
echo "Ожидание готовности MinIO..."\n\
./wait-for-it.sh minio:9000 --timeout=60 --strict\n\
echo "Инициализация MinIO..."\n\
python init_minio.py\n\
echo "Применение миграций..."\n\
python app/manage.py migrate\n\
echo "Создание суперпользователя (если не существует)..."\n\
python app/manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='\''admin'\'').exists() or User.objects.create_superuser('\''admin'\'', '\''admin@example.com'\'', '\''admin123'\'')" || true\n\
echo "Запуск Django сервера..."\n\
python app/manage.py runserver 0.0.0.0:8000' > /app/start.sh && chmod +x /app/start.sh

# Команда для запуска
CMD ["/app/start.sh"]