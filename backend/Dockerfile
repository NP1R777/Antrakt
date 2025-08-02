# Используем многоэтапную сборку для оптимизации
FROM python:3.11-slim as base

# Установка системных зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    python3-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Создание пользователя для безопасности
RUN useradd -m -s /bin/bash appuser

# Установка зависимостей Python
FROM base as dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Финальная стадия
FROM base as final
WORKDIR /app

# Копируем установленные зависимости
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Копирование приложения
COPY --chown=appuser:appuser . .

# Создание необходимых директорий
RUN mkdir -p /app/media /app/static && \
    chown -R appuser:appuser /app

# Переключение на пользователя appuser
USER appuser

# Установка переменных окружения
ENV PYTHONPATH=/app/app
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Проверка здоровья
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

# Expose порт
EXPOSE 8000

# Команда по умолчанию
CMD ["sh", "-c", "python app/manage.py migrate && gunicorn app.wsgi:application --bind 0.0.0.0:8000 --workers 4 --timeout 120"]