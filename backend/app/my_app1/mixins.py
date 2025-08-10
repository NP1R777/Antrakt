from django.db import models
from django.core.files.uploadedfile import UploadedFile


class ImageUploadMixin:
    """
    Заглушка-миксин: логика загрузки/удаления изображений отключена
    """
    
    def save(self, *args, **kwargs):
        # Игнорируем временные файлы изображений
        if hasattr(self, '_temp_image_file'):
            self._temp_image_file = None
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Ничего не удаляем из внешнего хранилища
        super().delete(*args, **kwargs)
    
    def set_image(self, image_file):
        """
        Устанавливает изображение для загрузки при следующем сохранении
        
        Args:
            image_file: Django UploadedFile
        """
        if isinstance(image_file, UploadedFile):
            # Отключено: ничего не делаем
            self._temp_image_file = None
        else:
            raise ValueError("image_file должен быть Django UploadedFile")
    
    def _get_image_folder(self):
        """
        Возвращает папку для сохранения изображений в зависимости от модели
        Переопределите в дочерних классах для кастомизации
        """
        return self.__class__.__name__.lower()