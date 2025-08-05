#!/usr/bin/env python3
"""
Скрипт для инициализации MinIO bucket
Запускается при первом запуске контейнера
Работает в режиме "без ожидания" - если MinIO недоступен, скрипт завершается успешно
"""

import os
import time
import socket
from minio import Minio
from minio.error import S3Error
from decouple import config

def is_service_available(host, port, timeout=2):
    """Проверяет доступность сервиса"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, int(port)))
        sock.close()
        return result == 0
    except:
        return False

def init_minio():
    """Инициализация MinIO bucket"""
    
    # Настройки MinIO
    minio_endpoint = config('MINIO_ENDPOINT', default='localhost:9000')
    minio_access_key = config('MINIO_ACCESS_KEY', default='minioadmin')
    minio_secret_key = config('MINIO_SECRET_KEY', default='minioadmin123')
    bucket_name = config('MINIO_BUCKET_NAME', default='antrakt-images')
    
    # Проверяем доступность MinIO
    try:
        minio_host, minio_port = minio_endpoint.split(':')
    except ValueError:
        print(f"Неверный формат MINIO_ENDPOINT: {minio_endpoint}")
        return False
    
    if not is_service_available(minio_host, minio_port):
        print(f"MinIO недоступен на {minio_endpoint}")
        print("Приложение будет работать без MinIO (локальное хранение файлов)")
        return True  # Возвращаем True для успешного завершения
    
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
        
        import json
        client.set_bucket_policy(bucket_name, json.dumps(policy))
        print(f"Политика доступа установлена для bucket '{bucket_name}'")
        
        return True
        
    except S3Error as e:
        print(f"Ошибка при инициализации MinIO: {e}")
        print("Приложение будет работать без MinIO (локальное хранение файлов)")
        return True  # Возвращаем True для продолжения работы без MinIO

if __name__ == "__main__":
    print("Проверка доступности MinIO...")
    
    # Пытаемся инициализировать MinIO (максимум 3 попытки)
    max_attempts = 3
    for attempt in range(max_attempts):
        print(f"Попытка {attempt + 1}/{max_attempts}")
        if init_minio():
            print("Инициализация завершена успешно!")
            exit(0)
        else:
            if attempt < max_attempts - 1:
                print("Ожидание 5 секунд перед следующей попыткой...")
                time.sleep(5)
    
    print("Приложение запускается без MinIO")
    exit(0)  # Завершаем успешно даже если MinIO недоступен