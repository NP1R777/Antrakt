# Быстрое решение проблемы с загрузкой файлов в MinIO

## Проблема
❌ **Файлы не загружаются в MinIO** - контейнер не запущен

## Быстрое решение

### 1. Автоматическое решение
```bash
./fix_minio.sh
```

### 2. Ручное решение
```bash
# Запуск MinIO контейнера
docker-compose up -d minio

# Проверка статуса
docker-compose ps minio

# Инициализация bucket
cd backend && python3 init_minio.py
```

### 3. Проверка
```bash
# Проверка доступности MinIO
cd backend && python3 simple_diagnose.py

# Доступ к веб-интерфейсу
# http://localhost:9001 (minioadmin / minioadmin123)
```

## Результат
✅ После запуска MinIO файлы будут автоматически загружаться в S3-хранилище
✅ При недоступности MinIO файлы сохраняются локально (fallback)

## Дополнительная информация
📖 Подробное руководство: `MINIO_TROUBLESHOOTING.md`