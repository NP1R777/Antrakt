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
            settings.MINIO_ENDPOINT,
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
        except S3Error as e:
            print(f"Ошибка при создании bucket: {e}")

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
            
            # Загружаем файл
            self.client.put_object(
                self.bucket_name,
                object_name,
                file,
                file.size if hasattr(file, 'size') else -1,
                content_type=content_type
            )
            
            # Возвращаем URL для доступа к файлу
            return f"http://{settings.MINIO_ENDPOINT}/{self.bucket_name}/{object_name}"
            
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
            # Извлекаем object_name из URL
            if file_url.startswith(f"http://{settings.MINIO_ENDPOINT}/{self.bucket_name}/"):
                object_name = file_url.replace(f"http://{settings.MINIO_ENDPOINT}/{self.bucket_name}/", "")
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


# Глобальный экземпляр клиента MinIO
minio_client = MinioClient()


def upload_image_to_minio(image_file, folder="images"):
    """
    Удобная функция для загрузки изображения в MinIO
    
    Args:
        image_file: Django UploadedFile
        folder: Папка для сохранения
        
    Returns:
        str: URL загруженного изображения
    """
    return minio_client.upload_file(image_file, folder)


def delete_image_from_minio(image_url):
    """
    Удобная функция для удаления изображения из MinIO
    
    Args:
        image_url: URL изображения для удаления
    """
    minio_client.delete_file(image_url)