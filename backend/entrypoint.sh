#!/usr/bin/env bash
set -euo pipefail

# Wait for Postgres
if [ -n "${DATABASE_HOST:-}" ]; then
  echo "Waiting for PostgreSQL at ${DATABASE_HOST}:${DATABASE_PORT:-5432}..."
  until pg_isready -h "${DATABASE_HOST}" -p "${DATABASE_PORT:-5432}" -U "${DATABASE_USER:-postgres}"; do
    sleep 1
  done
fi

cd /app

# Apply migrations and collect static (if any)
python -m django --version >/dev/null 2>&1 || true
python app/manage.py migrate --noinput
python app/manage.py collectstatic --noinput || true

# Create superuser in dev if env provided (optional)
if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ] && [ -n "${DJANGO_SUPERUSER_EMAIL:-}" ] && [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
  echo "Ensuring Django superuser exists..."
  python app/manage.py shell <<'PY'
from django.contrib.auth import get_user_model
import os
User = get_user_model()
username = os.environ['DJANGO_SUPERUSER_USERNAME']
email = os.environ['DJANGO_SUPERUSER_EMAIL']
password = os.environ['DJANGO_SUPERUSER_PASSWORD']
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
PY
fi

exec gunicorn app.wsgi:application --bind 0.0.0.0:8000 --workers ${GUNICORN_WORKERS:-3}

