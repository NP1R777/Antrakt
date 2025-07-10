# Установка и настройка для Windows

## Предварительные требования

### 1. Docker Desktop для Windows
1. Скачайте Docker Desktop с официального сайта: https://www.docker.com/products/docker-desktop
2. Установите Docker Desktop
3. Запустите Docker Desktop
4. Убедитесь, что Docker работает: откройте командную строку и выполните:
   ```cmd
   docker --version
   docker-compose --version
   ```

### 2. Python 3.8+
1. Скачайте Python с официального сайта: https://www.python.org/downloads/
2. При установке обязательно отметьте "Add Python to PATH"
3. Проверьте установку:
   ```cmd
   python --version
   pip --version
   ```

### 3. Git
1. Скачайте Git с официального сайта: https://git-scm.com/download/win
2. Установите Git
3. Проверьте установку:
   ```cmd
   git --version
   ```

## Установка проекта

### 1. Клонирование репозитория
```cmd
git clone <repository-url>
cd antrakt-admin
```

### 2. Запуск проекта

#### Способ A: PowerShell (рекомендуется)
1. Откройте PowerShell от имени администратора
2. Перейдите в папку проекта
3. Выполните:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\start_windows.ps1
   ```

#### Способ B: Batch файл
1. Откройте командную строку
2. Перейдите в папку проекта
3. Выполните:
   ```cmd
   start_windows.bat
   ```

#### Способ C: Ручная установка
```cmd
# 1. Запуск PostgreSQL и MinIO
docker-compose up -d postgres minio

# 2. Ожидание запуска сервисов (15 секунд)
timeout /t 15

# 3. Настройка Python окружения
cd backend
python -m venv venv
venv\Scripts\activate

# 4. Установка зависимостей
pip install -r requirements.txt

# 5. Применение миграций
python app\manage.py migrate

# 6. Инициализация MinIO
python init_minio.py

# 7. Запуск Django
python app\manage.py runserver
```

## Проверка установки

После успешного запуска вы должны иметь доступ к:

- **Django API**: http://localhost:8000
- **MinIO Console**: http://localhost:9001
  - Логин: `minioadmin`
  - Пароль: `minioadmin123`
- **Swagger API Docs**: http://localhost:8000/swagger/

## Управление проектом

### Остановка сервисов
```cmd
# Остановка Django (Ctrl+C в терминале)
# Остановка Docker сервисов
docker-compose down
```

### Перезапуск
```cmd
# Остановка
docker-compose down

# Запуск
docker-compose up -d postgres minio
cd backend
venv\Scripts\activate
python app\manage.py runserver
```

### Просмотр логов
```cmd
# Логи PostgreSQL
docker-compose logs postgres

# Логи MinIO
docker-compose logs minio
```

## Решение проблем

### Docker не запускается
1. Убедитесь, что Docker Desktop запущен
2. Проверьте, что WSL 2 включен (для Windows 10/11)
3. Перезапустите Docker Desktop

### Проблемы с портами
Если порты 5432, 8000, 9000, 9001 заняты:
1. Остановите сервисы, использующие эти порты
2. Или измените порты в `docker-compose.yml`

### Проблемы с Python
1. Убедитесь, что Python добавлен в PATH
2. Переустановите виртуальное окружение:
   ```cmd
   cd backend
   rmdir /s venv
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Проблемы с базой данных
1. Проверьте, что PostgreSQL запущен:
   ```cmd
   docker-compose ps postgres
   ```
2. Если не запущен, перезапустите:
   ```cmd
   docker-compose restart postgres
   ```

### Проблемы с MinIO
1. Проверьте, что MinIO запущен:
   ```cmd
   docker-compose ps minio
   ```
2. Если не запущен, перезапустите:
   ```cmd
   docker-compose restart minio
   ```
3. Проверьте доступность: http://localhost:9001

## Полезные команды

### Создание суперпользователя Django
```cmd
cd backend
venv\Scripts\activate
python app\manage.py createsuperuser
```

### Создание миграций
```cmd
cd backend
venv\Scripts\activate
python app\manage.py makemigrations
python app\manage.py migrate
```

### Тестирование MinIO
```cmd
cd backend
venv\Scripts\activate
python test_image_upload.py
```

### Очистка данных
```cmd
# Удаление всех данных (осторожно!)
docker-compose down -v
docker system prune -a
```

## Структура проекта

```
antrakt-admin/
├── backend/                 # Django приложение
│   ├── app/                # Основной проект Django
│   ├── my_app1/            # Приложение с моделями
│   ├── requirements.txt    # Зависимости Python
│   ├── .env               # Настройки окружения
│   └── venv/              # Виртуальное окружение
├── frontend/              # React приложение (в разработке)
├── docker-compose.yml     # Конфигурация Docker
├── start_windows.ps1      # PowerShell скрипт запуска
├── start_windows.bat      # Batch скрипт запуска
└── README.md              # Основная документация
```

## Поддержка

При возникновении проблем:
1. Проверьте логи Docker: `docker-compose logs`
2. Проверьте логи Django в терминале
3. Убедитесь, что все порты свободны
4. Перезапустите Docker Desktop
5. Создайте issue в репозитории проекта