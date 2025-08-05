@echo off
echo ========================================
echo Театральная студия "Антракт" - Автономный запуск
echo ========================================

echo.
echo АВТОНОМНЫЙ РЕЖИМ - БЕЗ ОЖИДАНИЯ DOCKER КОНТЕЙНЕРОВ
echo.
echo Приложение может работать:
echo - С PostgreSQL (если доступен) или SQLite (fallback)
echo - С MinIO (если доступен) или локальное хранение (fallback)
echo.

echo.
echo 1. Активация виртуального окружения...
if not exist "backend\venv\Scripts\activate.bat" (
    echo Создание виртуального окружения...
    cd backend
    python -m venv venv
    cd ..
)

echo.
echo 2. Установка зависимостей...
cd backend
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo 3. Применение миграций...
echo (Будет использована доступная БД: PostgreSQL или SQLite)
python app\manage.py migrate

echo.
echo 4. Проверка MinIO (без ожидания)...
python init_minio.py

echo.
echo 5. Запуск Django сервера...
echo.
echo Доступные сервисы:
echo - Django API: http://localhost:8000
echo - Swagger API: http://localhost:8000/swagger/
echo.
echo Опциональные сервисы (если запущены):
echo - MinIO Console: http://localhost:9001 (логин: minioadmin, пароль: minioadmin123)
echo - PostgreSQL: localhost:5432
echo.
echo Для остановки нажмите Ctrl+C
echo.

python app\manage.py runserver

pause