FROM python:3.11-slim

WORKDIR /backend

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование requirements и установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование исходного кода
COPY . .

# Создание статических файлов (если нужно)
RUN python manage.py collectstatic --noinput

# Запуск приложения
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "your_project_name.wsgi:application"]