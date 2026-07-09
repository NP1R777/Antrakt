#!/bin/sh
set -e

echo "==> Ожидание базы данных..."
python - <<'PY'
import os, time
import psycopg

cfg = dict(
    host=os.environ.get('DATABASE_HOST', 'db'),
    port=os.environ.get('DATABASE_PORT', '5432'),
    dbname=os.environ.get('DATABASE_NAME', 'antrakt'),
    user=os.environ.get('DATABASE_USER', 'postgres'),
    password=os.environ.get('DATABASE_PASSWORD', ''),
    connect_timeout=3,
)
for attempt in range(60):
    try:
        psycopg.connect(**cfg).close()
        print("==> База данных доступна")
        break
    except Exception as exc:
        print(f"    ждём БД ({attempt + 1}/60): {exc}")
        time.sleep(2)
else:
    raise SystemExit("База данных недоступна — прерываю запуск")
PY

echo "==> Применение миграций..."
python manage.py migrate --noinput

echo "==> Сбор статики..."
python manage.py collectstatic --noinput

echo "==> Запуск приложения..."
exec "$@"
