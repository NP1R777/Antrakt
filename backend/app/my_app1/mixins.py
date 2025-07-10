from django.db import models
from django.core.files.uploadedfile import UploadedFile
from .minio_utils import upload_image_to_minio, delete_image_from_minio


class ImageUploadMixin:
    """
    Миксин для автоматической загрузки изображений в MinIO
    """
    
    def save(self, *args, **kwargs):
        # Проверяем, есть ли новое изображение для загрузки
        if hasattr(self, '_temp_image_file') and self._temp_image_file:
            try:
                # Загружаем изображение в MinIO
                image_url = upload_image_to_minio(self._temp_image_file, self._get_image_folder())
                
                # Удаляем старое изображение, если оно существует
                if hasattr(self, 'image_url') and self.image_url:
                    try:
                        delete_image_from_minio(self.image_url)
                    except Exception as e:
                        print(f"Ошибка при удалении старого изображения: {e}")
                
                # Сохраняем новый URL
                self.image_url = image_url
                
                # Очищаем временный файл
                self._temp_image_file = None
                
            except Exception as e:
                print(f"Ошибка при загрузке изображения: {e}")
                # Если загрузка не удалась, не сохраняем URL
                pass
        
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Удаляем изображение из MinIO при удалении объекта
        if hasattr(self, 'image_url') and self.image_url:
            try:
                delete_image_from_minio(self.image_url)
            except Exception as e:
                print(f"Ошибка при удалении изображения: {e}")
        
        super().delete(*args, **kwargs)
    
    def set_image(self, image_file):
        """
        Устанавливает изображение для загрузки при следующем сохранении
        
        Args:
            image_file: Django UploadedFile
        """
        if isinstance(image_file, UploadedFile):
            self._temp_image_file = image_file
        else:
            raise ValueError("image_file должен быть Django UploadedFile")
    
    def _get_image_folder(self):
        """
        Возвращает папку для сохранения изображений в зависимости от модели
        Переопределите в дочерних классах для кастомизации
        """
        return self.__class__.__name__.lower()