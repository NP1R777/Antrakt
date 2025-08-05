@echo off
echo ========================================
echo Театральная студия "Антракт" - Запуск
echo ========================================

echo.
echo 1. Убедитесь, что PostgreSQL и MinIO запущены локально...
echo PostgreSQL должен быть доступен на порту 5432
echo MinIO должен быть доступен на портах 9000 и 9001

echo.
echo 2. Проверка подключения к сервисам...

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