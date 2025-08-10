import os
import uuid
from datetime import datetime, timedelta
from minio import Minio
from minio.error import S3Error
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import mimetypes


class MinioClient:
    def __init__(self):
        self.client = Minio(
            getattr(settings, 'MINIO_INTERNAL_ENDPOINT', settings.MINIO_ENDPOINT),
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=False  # Для локальной разработки
        )
        self.bucket_name = settings.MINIO_BUCKET_NAME
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self):
        """Проверяет существование bucket и создает его при необходимости"""
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)
                print(f"Bucket '{self.bucket_name}' создан успешно")
            # Гарантируем политику публичного чтения даже если бакет уже существует
            self._ensure_public_read_policy()
        except S3Error as e:
            print(f"Ошибка при создании bucket: {e}")

    def _ensure_public_read_policy(self):
        try:
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": ["*"]},
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{self.bucket_name}/*"],
                    }
                ],
            }
            import json
            self.client.set_bucket_policy(self.bucket_name, json.dumps(policy))
            print(f"Политика публичного чтения установлена для '{self.bucket_name}'")
        except Exception as e:
            # Несущественно для загрузки
            print(f"Не удалось установить политику публичного чтения: {e}")

    def upload_file(self, file, folder="images"):
        """
        Загружает файл в MinIO
        
        Args:
            file: Django UploadedFile или файловый объект
            folder: Папка внутри bucket для организации файлов
            
        Returns:
            str: URL загруженного файла
        """
        try:
            # Генерируем уникальное имя файла
            file_extension = os.path.splitext(file.name)[1] if hasattr(file, 'name') else '.jpg'
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            
            # Формируем путь к файлу
            object_name = f"{folder}/{datetime.now().strftime('%Y/%m/%d')}/{unique_filename}"
            
            # Определяем content type
            content_type = mimetypes.guess_type(file.name)[0] if hasattr(file, 'name') else 'image/jpeg'

            data = file
            length = None
            # Попробуем получить длину
            if hasattr(file, 'size'):
                length = file.size
            elif hasattr(file, 'seek') and hasattr(file, 'tell'):
                try:
                    current = file.tell()
                    file.seek(0, os.SEEK_END)
                    length = file.tell()
                    file.seek(current, os.SEEK_SET)
                except Exception:
                    length = None
            # Обнулим позицию потока, если возможно
            if hasattr(file, 'seek'):
                try:
                    file.seek(0)
                except Exception:
                    pass

            if length is not None and length >= 0:
                self.client.put_object(
                    self.bucket_name,
                    object_name,
                    data,
                    length,
                    content_type=content_type,
                )
            else:
                # неизвестная длина: используем multipart с разумным размером части
                self.client.put_object(
                    self.bucket_name,
                    object_name,
                    data,
                    -1,
                    part_size=10 * 1024 * 1024,
                    content_type=content_type,
                )
            
            public_endpoint = getattr(settings, 'MINIO_PUBLIC_ENDPOINT', settings.MINIO_ENDPOINT)
            return f"http://{public_endpoint}/{self.bucket_name}/{object_name}"
            
        except S3Error as e:
            print(f"Ошибка при загрузке файла в MinIO: {e}")
            raise

    def delete_file(self, file_url):
        """
        Удаляет файл из MinIO по URL
        
        Args:
            file_url: URL файла для удаления
        """
        try:
            public_endpoint = getattr(settings, 'MINIO_PUBLIC_ENDPOINT', settings.MINIO_ENDPOINT)
            if file_url.startswith(f"http://{public_endpoint}/{self.bucket_name}/"):
                object_name = file_url.replace(f"http://{public_endpoint}/{self.bucket_name}/", "")
                self.client.remove_object(self.bucket_name, object_name)
                print(f"Файл {object_name} удален успешно")
            else:
                print(f"Неверный формат URL: {file_url}")
        except S3Error as e:
            print(f"Ошибка при удалении файла: {e}")

    def get_file_url(self, object_name, expires=timedelta(hours=1)):
        """
        Генерирует временный URL для доступа к файлу
        
        Args:
            object_name: Имя объекта в bucket
            expires: Время жизни URL
            
        Returns:
            str: Временный URL для доступа к файлу
        """
        try:
            return self.client.presigned_get_object(
                self.bucket_name,
                object_name,
                expires=expires
            )
        except S3Error as e:
            print(f"Ошибка при генерации URL: {e}")
            return None


# Глобальный экземпляр клиента MinIO (ленивая инициализация)
_minio_client = None

def get_minio_client():
    """Получает экземпляр MinIO клиента с ленивой инициализацией"""
    global _minio_client
    if _minio_client is None:
        try:
            _minio_client = MinioClient()
            # Тестируем соединение, попробовав проверить существование bucket
            _minio_client.client.bucket_exists(_minio_client.bucket_name)
            print(f"✓ MinIO клиент успешно инициализирован: {_minio_client.client._base_url}")
        except Exception as e:
            print(f"⚠ Не удалось подключиться к MinIO: {e}")
            print("  Будет использоваться локальное хранение файлов")
            _minio_client = False  # Помечаем как недоступный
    return _minio_client if _minio_client is not False else None


def upload_image_to_minio(image_file, folder="images"):
    """
    Удобная функция для загрузки изображения в MinIO
    
    Args:
        image_file: Django UploadedFile
        folder: Папка для сохранения
        
    Returns:
        str: URL загруженного изображения или None если MinIO недоступен
    """
    client = get_minio_client()
    if client:
        try:
            return client.upload_file(image_file, folder)
        except Exception as e:
            print(f"Ошибка при загрузке в MinIO: {e}")
            print("Переключение на локальное хранение")
            return None
    else:
        print("MinIO недоступен, используется локальное хранение")
        return None


def delete_image_from_minio(image_url):
    """
    Удобная функция для удаления изображения из MinIO
    
    Args:
        image_url: URL изображения для удаления
    """
    client = get_minio_client()
    if client:
        client.delete_file(image_url)
    else:
        print("MinIO недоступен, удаление из локального хранения не требуется")