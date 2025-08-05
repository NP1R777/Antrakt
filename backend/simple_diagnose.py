#!/usr/bin/env python3
"""
Упрощенный диагностический скрипт для проверки подключения к MinIO
"""

import socket
import os

def is_service_available(host, port, timeout=5):
    """Проверяет доступность сервиса"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, int(port)))
        sock.close()
        return result == 0
    except Exception as e:
        print(f"Ошибка при проверке соединения: {e}")
        return False

def main():
    print("=== Простая диагностика MinIO ===")
    
    # Проверяем переменные окружения
    minio_endpoint = os.environ.get('MINIO_ENDPOINT', 'localhost:9000')
    minio_access_key = os.environ.get('MINIO_ACCESS_KEY', 'minioadmin')
    minio_secret_key = os.environ.get('MINIO_SECRET_KEY', 'minioadmin123')
    bucket_name = os.environ.get('MINIO_BUCKET_NAME', 'antrakt-images')
    
    print(f"Настройки из переменных окружения:")
    print(f"  MINIO_ENDPOINT: {minio_endpoint}")
    print(f"  MINIO_ACCESS_KEY: {minio_access_key}")
    print(f"  MINIO_SECRET_KEY: {'*' * len(minio_secret_key)}")
    print(f"  MINIO_BUCKET_NAME: {bucket_name}")
    print()
    
    # Парсим endpoint
    try:
        if ':' in minio_endpoint:
            minio_host, minio_port = minio_endpoint.split(':')
        else:
            minio_host = minio_endpoint
            minio_port = '9000'
    except ValueError:
        print(f"❌ Неверный формат MINIO_ENDPOINT: {minio_endpoint}")
        return False
    
    print(f"Проверка доступности {minio_host}:{minio_port}...")
    
    # Проверяем доступность порта
    if is_service_available(minio_host, minio_port):
        print(f"✅ Порт {minio_host}:{minio_port} доступен")
        return True
    else:
        print(f"❌ MinIO недоступен на {minio_host}:{minio_port}")
        print("Возможные причины:")
        print("  1. MinIO контейнер не запущен")
        print("  2. Неверный хост или порт")
        print("  3. Проблемы с сетью")
        
        # Дополнительные проверки
        print("\nДополнительные проверки:")
        
        # Проверка localhost
        if minio_host != 'localhost':
            print(f"Проверка localhost:9000...")
            if is_service_available('localhost', '9000'):
                print("✅ localhost:9000 доступен")
                print("💡 Попробуйте установить MINIO_ENDPOINT=localhost:9000")
            else:
                print("❌ localhost:9000 недоступен")
        
        # Проверка 127.0.0.1
        if minio_host != '127.0.0.1':
            print(f"Проверка 127.0.0.1:9000...")
            if is_service_available('127.0.0.1', '9000'):
                print("✅ 127.0.0.1:9000 доступен")
                print("💡 Попробуйте установить MINIO_ENDPOINT=127.0.0.1:9000")
            else:
                print("❌ 127.0.0.1:9000 недоступен")
        
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎉 MinIO доступен!")
    else:
        print("\n❌ MinIO недоступен!")