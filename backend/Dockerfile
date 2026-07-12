FROM python:3.11-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование requirements и установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование исходного кода (backend/ -> /app/).
# Django-проект лежит в backend/app (manage.py), поэтому рабочая
# директория — /app/app, а модуль настроек — app.settings.
COPY . .
WORKDIR /app/app

# Запуск приложения
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app.wsgi:application"]