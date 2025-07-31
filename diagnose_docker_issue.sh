#!/bin/bash

echo "=== Диагностика проблем Docker ==="

# Проверка версии Docker
echo "1. Версия Docker:"
docker --version
docker-compose --version

# Проверка статуса Docker демона
echo -e "\n2. Статус Docker демона:"
docker info | head -10

# Проверка доступной памяти и места
echo -e "\n3. Доступные ресурсы:"
df -h /
free -h

# Проверка запущенных контейнеров
echo -e "\n4. Текущие контейнеры:"
docker ps -a

# Проверка образов
echo -e "\n5. Доступные образы:"
docker images

# Проверка сетей Docker
echo -e "\n6. Docker сети:"
docker network ls

# Проверка подключения к интернету
echo -e "\n7. Проверка подключения:"
ping -c 3 8.8.8.8 || echo "Нет подключения к интернету"

# Проверка DNS
echo -e "\n8. Проверка DNS:"
nslookup hub.docker.com || echo "Проблемы с DNS"

# Проверка портов
echo -e "\n9. Занятые порты:"
netstat -tulpn | grep -E ":(3000|8000|5432|9000|9001)"

# Проверка файлов проекта
echo -e "\n10. Структура проекта:"
ls -la
echo -e "\nBackend файлы:"
ls -la backend/ | head -10
echo -e "\nFrontend файлы:"
ls -la frontend/ | head -10

# Проверка логов Docker
echo -e "\n11. Последние логи Docker:"
journalctl -u docker --no-pager -n 20 || echo "Не удалось получить логи systemd"

echo -e "\n=== Диагностика завершена ==="