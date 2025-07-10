@echo off
echo ========================================
echo Театральная студия "Антракт" - Запуск
echo ========================================

echo.
echo 1. Запуск PostgreSQL и MinIO через Docker...
docker-compose up -d postgres minio

echo.
echo 2. Ожидание запуска сервисов...
timeout /t 10 /nobreak > nul

echo.
echo 3. Активация виртуального окружения...
if not exist "backend\venv\Scripts\activate.bat" (
    echo Создание виртуального окружения...
    cd backend
    python -m venv venv
    cd ..
)

echo.
echo 4. Установка зависимостей...
cd backend
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo 5. Применение миграций...
python app\manage.py migrate

echo.
echo 6. Инициализация MinIO...
python init_minio.py

echo.
echo 7. Запуск Django сервера...
echo Django будет доступен по адресу: http://localhost:8000
echo MinIO Console: http://localhost:9001 (логин: minioadmin, пароль: minioadmin123)
echo Swagger API: http://localhost:8000/swagger/
echo.
echo Для остановки нажмите Ctrl+C
echo.

python app\manage.py runserver

pause