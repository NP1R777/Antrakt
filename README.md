# Театральная студия "Антракт" - Админ-панель

Проект админ-панели для театральной студии "Антракт" с автоматической загрузкой изображений в MinIO.

## Архитектура

- **Backend**: Django REST Framework
- **База данных**: PostgreSQL
- **Хранилище файлов**: MinIO (S3-совместимое)
- **Frontend**: React с TypeScript и Chakra UI

## Быстрый запуск

### Вариант 1: Windows (рекомендуется)

#### Предварительные требования

- Windows 10/11
- Docker Desktop для Windows
- Python 3.8+
- Git

#### Запуск

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd antrakt-admin
```

2. Запустите проект одним из способов:

**Способ A: PowerShell (рекомендуется)**
```powershell
.\start_windows.ps1
```

**Способ A1: PowerShell с существующим окружением**
```powershell
# Сначала активируйте ваше виртуальное окружение
venv\Scripts\Activate.ps1  # или путь к вашему окружению
.\start_windows_existing_env.ps1
```

**Способ B: Batch файл**
```cmd
start_windows.bat
```

**Способ C: Ручной запуск**
```bash
# 1. Запуск PostgreSQL и MinIO
docker-compose up -d postgres minio

# 2. Настройка Python окружения
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 3. Применение миграций
python app\manage.py migrate

# 4. Инициализация MinIO
python init_minio.py

# 5. Запуск Django
python app\manage.py runserver
```

**Способ D: Быстрый запуск Django (если окружение уже настроено)**
```powershell
# Активируйте ваше виртуальное окружение
venv\Scripts\Activate.ps1  # или путь к вашему окружению

# Запустите только Django
.\start_django_only.ps1
```

### Вариант 2: Docker (для Linux/macOS)

#### Предварительные требования

- Docker
- Docker Compose

#### Запуск

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd antrakt-admin
```

2. Запустите все сервисы:
```bash
docker-compose up -d
```

3. Проверьте статус сервисов:
```bash
docker-compose ps
```

### Доступ к сервисам

- **Django API**: http://localhost:8000
- **MinIO Console**: http://localhost:9001
  - Логин: `minioadmin`
  - Пароль: `minioadmin123`
- **Swagger API Docs**: http://localhost:8000/swagger/

## API для работы с изображениями

### Загрузка изображения

```bash
POST /upload-image/
Content-Type: multipart/form-data

# Параметры:
# - image: файл изображения (обязательно)
# - folder: папка для сохранения (опционально, по умолчанию "images")
```

**Пример ответа:**
```json
{
    "success": true,
    "image_url": "http://localhost:9000/antrakt-images/images/2024/01/15/uuid.jpg",
    "message": "Изображение успешно загружено"
}
```

### Удаление изображения

```bash
DELETE /delete-image/?image_url=http://localhost:9000/antrakt-images/images/2024/01/15/uuid.jpg
```

**Пример ответа:**
```json
{
    "success": true,
    "message": "Изображение успешно удалено"
}
```

## Модели с поддержкой изображений

Все модели с полем `image_url` автоматически поддерживают загрузку изображений:

- **Perfomances** (Спектакли)
- **Actors** (Актеры)
- **DirectorsTheatre** (Режиссеры)
- **News** (Новости)
- **Archive** (Архив)
- **Achievements** (Достижения)

## Использование в коде

### Загрузка изображения при создании объекта

```python
from my_app1.models import Perfomances
from django.core.files.uploadedfile import UploadedFile

# Создание объекта
perfomance = Perfomances(
    title="Название спектакля",
    author="Автор",
    genre="Драма",
    age_limit="12+",
    description="Описание спектакля"
)

# Установка изображения
perfomance.set_image(image_file)  # image_file - Django UploadedFile

# Сохранение (изображение автоматически загрузится в MinIO)
perfomance.save()
```

### Обновление изображения

```python
# Получение объекта
perfomance = Perfomances.objects.get(id=1)

# Установка нового изображения
perfomance.set_image(new_image_file)

# Сохранение (старое изображение автоматически удалится, новое загрузится)
perfomance.save()
```

## Frontend интеграция

### Запуск Frontend

1. Перейдите в папку frontend:
```bash
cd frontend/antrakt
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите development сервер:
```bash
npm start
```

Frontend будет доступен по адресу: http://localhost:3000

### Компоненты для работы с изображениями

#### ImageUpload компонент

Универсальный компонент для загрузки изображений с предварительным просмотром:

```typescript
import ImageUpload from '../components/ImageUpload';

<ImageUpload
    currentImageUrl={imageUrl}
    onImageUpload={handleImageUpload}
    onImageRemove={handleImageRemove}
    contentType="actors"
    maxSize={10}
    disabled={false}
/>
```

#### ImageService

Сервис для работы с API загрузки изображений:

```typescript
import ImageService from '../services/ImageService';

// Загрузка изображения
const imageUrl = await ImageService.uploadImage(file, 'actors');

// Удаление изображения
const success = await ImageService.deleteImage(imageUrl);
```

### Интегрированные страницы

- **Актеры** (`/admin/actors`) - управление актерами с загрузкой фотографий
- **Спектакли** (`/admin/performances`) - управление спектаклями с загрузкой постеров
- **Новости** (`/admin/news`) - управление новостями с загрузкой изображений

### Поддерживаемые форматы изображений

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

Максимальный размер файла: 10MB

## Структура хранения в MinIO

```
antrakt-images/
├── perfomances/
│   └── 2024/
│       └── 01/
│           └── 15/
│               └── uuid.jpg
├── actors/
│   └── 2024/
│       └── 01/
│           └── 15/
│               └── uuid.png
├── directors/
├── news/
├── archive/
└── achievements/
```

## Настройки окружения

Создайте файл `.env` в папке `backend/`:

```env
# Database settings
DATABASE_NAME=antrakt
DATABASE_USER=postgres
DATABASE_PASSWORD=123
DATABASE_HOST=localhost
DATABASE_PORT=5432

# MinIO settings
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=antrakt-images

# Django settings
SECRET_KEY=your-secret-key
DEBUG=True
```

## Разработка

### Локальная разработка без Docker

1. Установите зависимости:
```bash
cd backend
pip install -r requirements.txt
```

2. Запустите PostgreSQL и MinIO через Docker:
```bash
docker-compose up postgres minio -d
```

3. Примените миграции:
```bash
python app/manage.py migrate
```

4. Запустите сервер разработки:
```bash
python app/manage.py runserver
```

### Создание миграций

```bash
python app/manage.py makemigrations
python app/manage.py migrate
```

### Создание суперпользователя

```bash
python app/manage.py createsuperuser
```

## Безопасность

- Все API endpoints для загрузки изображений требуют аутентификации
- Поддерживаются только изображения (JPEG, PNG, GIF, WebP)
- Максимальный размер файла: 10MB
- Автоматическое удаление старых изображений при обновлении

## Мониторинг

### Логи MinIO

```bash
docker-compose logs minio
```

### Логи Django

```bash
docker-compose logs backend
```

### Проверка здоровья сервисов

```bash
# MinIO
curl http://localhost:9000/minio/health/live

# Django
curl http://localhost:8000/admin/
```

## Troubleshooting

### MinIO не запускается

1. Проверьте, что порты 9000 и 9001 свободны
2. Удалите volume и пересоздайте:
```bash
docker-compose down -v
docker-compose up -d
```

### Проблемы с загрузкой изображений

1. Проверьте подключение к MinIO:
```bash
curl http://localhost:9000/minio/health/live
```

2. Проверьте bucket в MinIO Console: http://localhost:9001

3. Проверьте логи Django:
```bash
docker-compose logs backend
```

### Проблемы с базой данных

1. Проверьте подключение к PostgreSQL:
```bash
docker-compose exec postgres psql -U postgres -d antrakt
```

2. Примените миграции:
```bash
docker-compose exec backend python app/manage.py migrate
```