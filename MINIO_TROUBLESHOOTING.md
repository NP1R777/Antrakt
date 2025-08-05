# Диагностика и решение проблем с MinIO

## Обнаруженная проблема

После анализа вашего проекта выявлено, что **MinIO контейнер не запущен**, из-за чего файлы не загружаются в S3-хранилище.

## Диагностика

### 1. Проверка статуса MinIO
Результат диагностики показал:
- ❌ MinIO недоступен на localhost:9000
- ❌ Порт 9000 не используется
- ❌ MinIO контейнер не запущен

### 2. Анализ кода
Ваш код правильно настроен с fallback механизмом:
- При недоступности MinIO используется локальное хранение
- Настройка `USE_MINIO = False` срабатывает автоматически
- Функция `upload_image_to_minio()` возвращает `None` при недоступности MinIO

## Решения

### Вариант 1: Запуск через Docker Compose (Рекомендуемый)

```bash
# Запуск всех сервисов включая MinIO
docker-compose up -d

# Проверка статуса контейнеров
docker-compose ps

# Просмотр логов MinIO
docker-compose logs minio
```

### Вариант 2: Запуск через готовые скрипты

```bash
# Для Linux/Mac
./start_standalone.sh

# Для Windows
start_windows_standalone.bat
# или
start_windows_standalone.ps1
```

### Вариант 3: Ручной запуск только MinIO

```bash
# Запуск только MinIO контейнера
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin123 \
  -v minio_data:/data \
  minio/minio:latest \
  server /data --console-address ":9001"
```

## Проверка работоспособности

### 1. Проверка доступности MinIO
```bash
cd backend
python3 simple_diagnose.py
```

### 2. Проверка через браузер
- MinIO API: http://localhost:9000
- MinIO Console: http://localhost:9001
- Логин: `minioadmin`
- Пароль: `minioadmin123`

### 3. Инициализация bucket
```bash
cd backend
python3 init_minio.py
```

## Конфигурация

### Переменные окружения
Убедитесь, что установлены правильные переменные:

```env
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=antrakt-images
```

### Docker Compose настройки
В `docker-compose.yml` уже правильно настроены:
- Порты: 9000 (API), 9001 (Console)
- Healthcheck для проверки доступности
- Volume для постоянного хранения данных

## Возможные проблемы и решения

### 1. Порт уже используется
```bash
# Найти процесс, использующий порт 9000
sudo lsof -i :9000

# Остановить конфликтующий процесс или изменить порт MinIO
```

### 2. Проблемы с правами доступа
```bash
# Проверить права на volume
docker volume inspect minio_data

# Пересоздать volume при необходимости
docker volume rm minio_data
```

### 3. Проблемы с сетью Docker
```bash
# Пересоздать Docker сеть
docker network rm antrakt_network
docker-compose up -d
```

### 4. Ошибки аутентификации
Проверьте, что в настройках Django используются правильные credentials:
- Access Key: `minioadmin`
- Secret Key: `minioadmin123`

## Альтернативные решения

### 1. Использование локального хранения
Если MinIO не критичен, код уже поддерживает fallback на локальное хранение файлов в `media/` директории.

### 2. Использование внешнего S3
Можно настроить подключение к AWS S3 или другому S3-совместимому хранилищу, изменив настройки в `settings.py`.

## Автоматизация запуска

### Создание systemd сервиса (Linux)
```bash
# Создать файл /etc/systemd/system/antrakt.service
sudo systemctl enable antrakt
sudo systemctl start antrakt
```

### Использование Docker Desktop (Windows/Mac)
Настроить автозапуск контейнеров через Docker Desktop.

## Мониторинг

### Healthcheck в Docker Compose
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
  interval: 10s
  timeout: 10s
  retries: 3
```

### Логирование
```bash
# Просмотр логов MinIO
docker-compose logs -f minio

# Просмотр логов backend
docker-compose logs -f backend
```

## Заключение

Основная проблема - **не запущен MinIO контейнер**. Запустите MinIO через один из предложенных способов, и загрузка файлов заработает.

Ваш код уже правильно обрабатывает ситуации с недоступностью MinIO, поэтому после запуска контейнера все должно работать автоматически.