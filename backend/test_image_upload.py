#!/usr/bin/env python3
"""
Скрипт для тестирования загрузки изображений в MinIO
"""

import os
import sys
import django
from django.core.files.uploadedfile import SimpleUploadedFile
from decouple import config

# Добавляем путь к Django проекту
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from my_app1.models import Perfomances, Actors, News
from my_app1.minio_utils import upload_image_to_minio, delete_image_from_minio

def create_test_image():
    """Создает тестовое изображение в памяти"""
    # Создаем простое изображение (1x1 пиксель PNG)
    image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\x0cIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xf5\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82'
    
    return SimpleUploadedFile(
        name='test_image.png',
        content=image_data,
        content_type='image/png'
    )

def test_minio_connection():
    """Тестирует подключение к MinIO"""
    print("Тестирование подключения к MinIO...")
    
    try:
        from my_app1.minio_utils import minio_client
        print("✓ Подключение к MinIO успешно")
        return True
    except Exception as e:
        print(f"✗ Ошибка подключения к MinIO: {e}")
        return False

def test_image_upload():
    """Тестирует загрузку изображения"""
    print("\nТестирование загрузки изображения...")
    
    try:
        # Создаем тестовое изображение
        test_image = create_test_image()
        
        # Загружаем изображение
        image_url = upload_image_to_minio(test_image, 'test')
        
        print(f"✓ Изображение загружено: {image_url}")
        
        # Удаляем тестовое изображение
        delete_image_from_minio(image_url)
        print("✓ Тестовое изображение удалено")
        
        return True
    except Exception as e:
        print(f"✗ Ошибка при загрузке изображения: {e}")
        return False

def test_model_with_image():
    """Тестирует создание модели с изображением"""
    print("\nТестирование создания модели с изображением...")
    
    try:
        # Создаем тестовое изображение
        test_image = create_test_image()
        
        # Создаем объект модели
        perfomance = Perfomances(
            title="Тестовый спектакль",
            author="Тестовый автор",
            genre="Тест",
            age_limit="12+",
            description="Тестовое описание спектакля"
        )
        
        # Устанавливаем изображение
        perfomance.set_image(test_image)
        
        # Сохраняем объект
        perfomance.save()
        
        print(f"✓ Модель создана с изображением: {perfomance.image_url}")
        
        # Удаляем тестовый объект
        perfomance.delete()
        print("✓ Тестовая модель удалена")
        
        return True
    except Exception as e:
        print(f"✗ Ошибка при создании модели: {e}")
        return False

def main():
    """Основная функция тестирования"""
    print("=== Тестирование MinIO интеграции ===\n")
    
    # Тест 1: Подключение к MinIO
    if not test_minio_connection():
        print("\n❌ Тест подключения к MinIO провален")
        return False
    
    # Тест 2: Загрузка изображения
    if not test_image_upload():
        print("\n❌ Тест загрузки изображения провален")
        return False
    
    # Тест 3: Создание модели с изображением
    if not test_model_with_image():
        print("\n❌ Тест создания модели провален")
        return False
    
    print("\n✅ Все тесты пройдены успешно!")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)