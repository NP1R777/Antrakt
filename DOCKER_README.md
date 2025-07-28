# Docker конфигурация для проекта ANTRAKT

Этот проект настроен для работы в Docker контейнерах с полной изоляцией всех сервисов.

## Структура контейнеров

- **postgres** - PostgreSQL 15 база данных
- **minio** - MinIO объектное хранилище для файлов
- **backend** - Django REST API приложение
- **frontend** - React приложение с Nginx

## Быстрый старт (Windows)

### 1. Создание дампа локальной базы данных

Перед запуском контейнеров создайте дамп вашей локальной базы данных:

```cmd
create_database_dump.bat
```

Скрипт запросит параметры подключения к вашей локальной PostgreSQL базе:
- Host (по умолчанию: localhost)
- Port (по умолчанию: 5432)
- Database (по умолчанию: antrakt)
- Username (по умолчанию: postgres)

### 2. Запуск контейнеров

```cmd
start_docker.bat
```

Этот скрипт:
- Проверит наличие Docker
- Остановит существующие контейнеры
- Соберет и запустит все сервисы

## Доступ к сервисам

После успешного запуска будут доступны:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MinIO Console**: http://localhost:9001 (admin/admin123)
- **PostgreSQL**: localhost:5432

## Управление контейнерами

### Просмотр статуса
```bash
docker-compose ps
```

### Просмотр логов
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Остановка
```bash
docker-compose down
```

### Остановка с удалением данных
```bash
docker-compose down -v
```

### Пересборка контейнеров
```bash
docker-compose up --build
```

## Ручная настройка (Linux/macOS)

### 1. Создание дампа базы данных

```bash
cd database
chmod +x create_dump.sh
./create_dump.sh [host] [port] [database] [username]
```

### 2. Запуск контейнеров

```bash
docker-compose up --build -d
```

## Конфигурация

### Переменные окружения

Скопируйте `.env.example` в `.env` и настройте при необходимости:

```bash
cp .env.example .env
```

### Настройка портов

По умолчанию используются порты:
- Frontend: 3000
- Backend: 8000
- PostgreSQL: 5432
- MinIO: 9000 (API), 9001 (Console)

Для изменения портов отредактируйте `docker-compose.yml`.

## Разработка

### Монтирование кода для разработки

Для разработки можно монтировать код напрямую:

```yaml
# В docker-compose.yml добавить в секцию backend:
volumes:
  - ./backend/app:/app/app:ro
  - backend_media:/app/media
  - backend_static:/app/static

# В секцию frontend:
volumes:
  - ./frontend/antrakt/src:/app/src:ro
```

### Выполнение команд в контейнерах

```bash
# Django команды
docker-compose exec backend python app/manage.py migrate
docker-compose exec backend python app/manage.py createsuperuser
docker-compose exec backend python app/manage.py collectstatic

# Доступ к shell
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d antrakt
```

## Решение проблем

### Контейнер не запускается

1. Проверьте логи:
   ```bash
   docker-compose logs [service_name]
   ```

2. Проверьте доступность портов:
   ```bash
   netstat -an | grep :3000
   netstat -an | grep :8000
   ```

### База данных пуста

1. Убедитесь, что файл `database/init.sql` содержит дамп
2. Пересоздайте контейнер PostgreSQL:
   ```bash
   docker-compose down
   docker volume rm antrakt_postgres_data
   docker-compose up postgres
   ```

### MinIO недоступен

1. Проверьте, что контейнер MinIO запущен:
   ```bash
   docker-compose ps minio
   ```

2. Проверьте логи MinIO:
   ```bash
   docker-compose logs minio
   ```

### Проблемы с сетью

Если сервисы не могут связаться друг с другом:

```bash
# Пересоздать сеть
docker-compose down
docker network prune
docker-compose up
```

## Backup и восстановление

### Создание backup базы данных

```bash
docker-compose exec postgres pg_dump -U postgres antrakt > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление из backup

```bash
docker-compose exec -T postgres psql -U postgres antrakt < backup_file.sql
```

### Backup MinIO данных

```bash
docker-compose exec minio mc mirror /data ./minio_backup/
```

## Производственная конфигурация

Для продакшена рекомендуется:

1. Использовать отдельный `docker-compose.prod.yml`
2. Настроить SSL/TLS
3. Использовать внешние базы данных
4. Настроить мониторинг и логирование
5. Использовать секреты вместо переменных окружения

## Требования

- Docker Desktop (Windows/macOS) или Docker Engine + Docker Compose (Linux)
- PostgreSQL client tools (для создания дампа)
- Минимум 4GB RAM
- Минимум 10GB свободного места на диске