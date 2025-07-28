@echo off
title ANTRAKT Docker Manager

:menu
cls
echo ========================================
echo          ANTRAKT Docker Manager
echo ========================================
echo.
echo 1. Создать дамп локальной базы данных
echo 2. Запустить все контейнеры
echo 3. Остановить все контейнеры  
echo 4. Просмотреть логи
echo 5. Просмотреть статус контейнеров
echo 6. Пересобрать контейнеры
echo 7. Очистить все данные (осторожно!)
echo 8. Открыть веб-интерфейсы
echo 9. Справка
echo 0. Выход
echo.
echo ========================================

set /p choice="Выберите действие (0-9): "

if "%choice%"=="1" goto create_dump
if "%choice%"=="2" goto start_containers
if "%choice%"=="3" goto stop_containers
if "%choice%"=="4" goto view_logs
if "%choice%"=="5" goto view_status
if "%choice%"=="6" goto rebuild_containers
if "%choice%"=="7" goto clean_all
if "%choice%"=="8" goto open_web
if "%choice%"=="9" goto help
if "%choice%"=="0" goto exit
echo Неверный выбор!
pause
goto menu

:create_dump
cls
echo Создание дампа локальной базы данных...
call create_database_dump.bat
pause
goto menu

:start_containers
cls
echo Запуск контейнеров...
call start_docker.bat
pause
goto menu

:stop_containers
cls
echo Остановка контейнеров...
call stop_docker.bat
pause
goto menu

:view_logs
cls
echo Просмотр логов...
call view_logs.bat
pause
goto menu

:view_status
cls
echo Статус контейнеров:
echo ==================
docker-compose ps
echo.
echo Использование ресурсов:
echo =====================
docker stats --no-stream
pause
goto menu

:rebuild_containers
cls
echo ВНИМАНИЕ: Пересборка контейнеров может занять несколько минут
set /p confirm="Продолжить? (y/N): "
if /i not "%confirm%"=="y" goto menu
echo Пересборка контейнеров...
docker-compose down
docker-compose build --no-cache
docker-compose up -d
echo Пересборка завершена!
pause
goto menu

:clean_all
cls
echo ==========================================
echo   ВНИМАНИЕ: ОПАСНАЯ ОПЕРАЦИЯ!
echo ==========================================
echo Это действие удалит:
echo - Все контейнеры
echo - Все volumes (включая данные БД)
echo - Все образы проекта
echo - Неиспользуемые сети
echo.
echo Данные будут БЕЗВОЗВРАТНО УТЕРЯНЫ!
echo.
set /p confirm="Вы уверены? Введите 'DELETE' для подтверждения: "
if not "%confirm%"=="DELETE" (
    echo Операция отменена
    pause
    goto menu
)
echo Удаление всех данных...
docker-compose down -v
docker system prune -f
docker volume prune -f
echo Очистка завершена!
pause
goto menu

:open_web
cls
echo Открытие веб-интерфейсов...
echo.
echo Попытка открыть в браузере:
start http://localhost:3000
start http://localhost:8000
start http://localhost:9001
echo.
echo Если браузер не открылся автоматически:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000  
echo - MinIO Console: http://localhost:9001
pause
goto menu

:help
cls
echo ========================================
echo              СПРАВКА
echo ========================================
echo.
echo Порядок первого запуска:
echo 1. Создать дамп локальной БД (пункт 1)
echo 2. Запустить контейнеры (пункт 2)
echo 3. Открыть веб-интерфейсы (пункт 8)
echo.
echo Доступные сервисы после запуска:
echo - Frontend (React):     http://localhost:3000
echo - Backend API (Django): http://localhost:8000
echo - MinIO Console:        http://localhost:9001
echo - PostgreSQL:           localhost:5432
echo.
echo Учетные данные MinIO:
echo - Пользователь: minioadmin
echo - Пароль: minioadmin123
echo.
echo Для разработки можете использовать:
echo - docker-compose exec backend bash
echo - docker-compose exec postgres psql -U postgres -d antrakt
echo.
echo Подробная документация: DOCKER_README.md
echo.
pause
goto menu

:exit
echo Выход из Docker Manager...
exit /b 0