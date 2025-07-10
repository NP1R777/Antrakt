FROM python:3.11-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Установка рабочей директории
WORKDIR /app

# Копирование requirements и установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода приложения
COPY . .

# Создание директории для статических файлов
RUN mkdir -p /app/static

# Открытие порта
EXPOSE 8000

# Создание скрипта запуска
RUN echo '#!/bin/bash\n\
echo "Инициализация MinIO..."\n\
python init_minio.py\n\
echo "Запуск Django..."\n\
python app/manage.py migrate\n\
python app/manage.py runserver 0.0.0.0:8000' > /app/start.sh && chmod +x /app/start.sh

# Команда для запуска
CMD ["/app/start.sh"]