# 🐳 Docker Setup для проекта Antrakt

Это руководство поможет вам развернуть проект Antrakt используя Docker и Docker Compose.

## 📋 Предварительные требования

- **Docker Desktop** для Windows (версия 4.0+)
- **Git** для клонирования репозитория
- **PostgreSQL** (только для создания дампа локальной БД)

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <your-repo-url>
cd antrakt
```

### 2. Настройка переменных окружения

Скопируйте файл `.env.example` в `.env` и настройте его:

```bash
copy .env.example .env
```

**Важно!** Обязательно измените следующие параметры в `.env`:
- `SECRET_KEY` - используйте длинный случайный ключ
- `POSTGRES_PASSWORD` - установите безопасный пароль
- `MINIO_ROOT_PASSWORD` - установите безопасный пароль

### 3. Создание дампа базы данных (опционально)

Если у вас есть локальная база данных, которую нужно перенести:

#### Из локального PostgreSQL:
```bash
cd database
create_dump.bat localhost 5432 antrakt postgres
```

#### Из существующего Docker контейнера:
```bash
cd database
create_dump_docker.bat postgres antrakt postgres
```

Дамп будет сохранен как `database/init.sql` и автоматически загружен при первом запуске.

### 4. Сборка и запуск

```bash
# Сборка всех сервисов
docker-compose build

# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f
```

## 🏗️ Архитектура проекта

```
📦 Antrakt Docker Setup
├── 🌐 Frontend (React + Nginx) - порт 3000
├── 🔧 Backend (Django + Gunicorn) - порт 8000
├── 🗄️ PostgreSQL - порт 5432
└── 📁 MinIO (S3-совместимое хранилище) - порты 9000/9001
```

## 🔧 Конфигурация сервисов

### Frontend (React + Nginx)
- **Порт**: 3000 (настраивается через `FRONTEND_PORT`)
- **Технологии**: React, Nginx
- **Особенности**: 
  - Gzip сжатие
  - Кэширование статических файлов
  - Проксирование API запросов к бэкенду

### Backend (Django + Gunicorn)
- **Порт**: 8000 (настраивается через `BACKEND_PORT`)
- **Технологии**: Django, Gunicorn, PostgreSQL
- **Особенности**:
  - Автоматические миграции при запуске
  - Health check эндпоинт
  - Интеграция с MinIO для файлов

### PostgreSQL
- **Порт**: 5432 (настраивается через `POSTGRES_EXTERNAL_PORT`)
- **Особенности**:
  - Автоматическая инициализация из дампа
  - Persistent storage

### MinIO
- **API порт**: 9000, **Console порт**: 9001
- **Доступ**: http://localhost:9001
- **Особенности**: S3-совместимое хранилище файлов

## 📝 Полезные команды

### Управление контейнерами

```bash
# Запуск всех сервисов
docker-compose up -d

# Остановка всех сервисов
docker-compose down

# Перезапуск конкретного сервиса
docker-compose restart backend

# Просмотр статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f [service_name]
```

### Работа с базой данных

```bash
# Подключение к PostgreSQL
docker-compose exec postgres psql -U postgres -d antrakt

# Создание дампа из контейнера
docker-compose exec postgres pg_dump -U postgres -d antrakt > backup.sql

# Восстановление дампа
docker-compose exec -T postgres psql -U postgres -d antrakt < backup.sql
```

### Работа с бэкендом

```bash
# Выполнение команд Django
docker-compose exec backend python app/manage.py migrate
docker-compose exec backend python app/manage.py createsuperuser
docker-compose exec backend python app/manage.py collectstatic

# Подключение к контейнеру
docker-compose exec backend bash
```

### Очистка

```bash
# Остановка и удаление контейнеров
docker-compose down

# Удаление с volumes (ОСТОРОЖНО: удалит все данные!)
docker-compose down -v

# Очистка неиспользуемых образов
docker system prune -a
```

## 🔍 Мониторинг и отладка

### Health Checks

Все сервисы имеют встроенные health checks:

- **Frontend**: http://localhost:3000/health
- **Backend**: http://localhost:8000/health/
- **PostgreSQL**: автоматическая проверка через `pg_isready`
- **MinIO**: http://localhost:9000/minio/health/live

### Логи

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f minio
```

### Отладка проблем

1. **Проверьте статус контейнеров**:
   ```bash
   docker-compose ps
   ```

2. **Проверьте логи на ошибки**:
   ```bash
   docker-compose logs
   ```

3. **Проверьте health checks**:
   ```bash
   docker-compose exec backend curl -f http://localhost:8000/health/
   ```

4. **Проверьте подключение к БД**:
   ```bash
   docker-compose exec postgres pg_isready -U postgres
   ```

## 🛠️ Разработка

### Режим разработки

Для разработки можно раскомментировать volume mapping в `docker-compose.yml`:

```yaml
backend:
  volumes:
    - ./backend:/app  # Раскомментируйте эту строку
```

Это позволит видеть изменения в коде без пересборки контейнера.

### Переменные окружения

Основные переменные в `.env`:

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DEBUG` | Режим отладки Django | `False` |
| `SECRET_KEY` | Секретный ключ Django | - |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL | `123` |
| `MINIO_ROOT_PASSWORD` | Пароль MinIO | `minioadmin123` |

## 🚨 Безопасность

### Для продакшена:

1. **Измените все пароли** в `.env`
2. **Установите сильный SECRET_KEY**
3. **Настройте ALLOWED_HOSTS** с вашим доменом
4. **Используйте HTTPS**
5. **Настройте файрвол** для ограничения доступа к портам

### Рекомендуемые изменения:

```bash
# Генерация SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose logs`
2. Убедитесь, что все порты свободны
3. Проверьте настройки в `.env`
4. Попробуйте пересобрать: `docker-compose build --no-cache`

## 🎯 Доступ к сервисам

После успешного запуска:

- **Фронтенд**: http://localhost:3000
- **Бэкенд API**: http://localhost:8000
- **MinIO Console**: http://localhost:9001
- **PostgreSQL**: localhost:5432

---

*Создано для проекта Antrakt* 🚀