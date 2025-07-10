#!/usr/bin/env python3
"""
Скрипт для инициализации MinIO bucket
Запускается при первом запуске контейнера
"""

import os
import time
from minio import Minio
from minio.error import S3Error
from decouple import config

def init_minio():
    """Инициализация MinIO bucket"""
    
    # Настройки MinIO
    minio_endpoint = config('MINIO_ENDPOINT', default='localhost:9000')
    minio_access_key = config('MINIO_ACCESS_KEY', default='minioadmin')
    minio_secret_key = config('MINIO_SECRET_KEY', default='minioadmin123')
    bucket_name = config('MINIO_BUCKET_NAME', default='antrakt-images')
    
    print(f"Подключение к MinIO: {minio_endpoint}")
    
    # Создаем клиент MinIO
    client = Minio(
        minio_endpoint,
        access_key=minio_access_key,
        secret_key=minio_secret_key,
        secure=False  # Для локальной разработки
    )
    
    try:
        # Проверяем существование bucket
        if not client.bucket_exists(bucket_name):
            print(f"Создание bucket: {bucket_name}")
            client.make_bucket(bucket_name)
            print(f"Bucket '{bucket_name}' создан успешно")
        else:
            print(f"Bucket '{bucket_name}' уже существует")
        
        # Устанавливаем политику доступа (публичное чтение)
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": "*"},
                    "Action": ["s3:GetObject"],
                    "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
                }
            ]
        }
        
        client.set_bucket_policy(bucket_name, policy)
        print(f"Политика доступа установлена для bucket '{bucket_name}'")
        
        return True
        
    except S3Error as e:
        print(f"Ошибка при инициализации MinIO: {e}")
        return False

if __name__ == "__main__":
    # Ждем немного, чтобы MinIO успел запуститься
    print("Ожидание запуска MinIO...")
    time.sleep(5)
    
    # Пытаемся инициализировать MinIO
    max_attempts = 10
    for attempt in range(max_attempts):
        print(f"Попытка {attempt + 1}/{max_attempts}")
        if init_minio():
            print("MinIO инициализирован успешно!")
            break
        else:
            print("Ожидание 10 секунд перед следующей попыткой...")
            time.sleep(10)
    else:
        print("Не удалось инициализировать MinIO после всех попыток")
        exit(1)