from django.db import models
from django.contrib.postgres import fields
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from .mixins import ImageUploadMixin


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Пользователь должен иметь email')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Суперпользователь должен иметь is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    class Meta:
        db_table = 'user'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True, default=None, blank=True)
    email = models.EmailField(unique=True, null=False)
    password = models.CharField(max_length=500, null=False)
    phone_number = models.CharField(max_length=20)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    profile_photo = models.URLField(null=False, blank=True)
    access_token = models.CharField(max_length=500, blank=True, null=True)
    refresh_token = models.CharField(max_length=500, blank=True, null=True)

    USERNAME_FIELD = "email"

    objects = CustomUserManager()


class Perfomances(ImageUploadMixin, models.Model): # Спектакли
    class Meta:
        db_table = 'perfomances'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    title = models.CharField(max_length=50, null=False) # Название спектакля
    author = models.CharField(max_length=50, null=False)
    genre = models.CharField(max_length=20, null=False)
    age_limit = models.CharField(max_length=5, null=False)
    duration = models.TimeField(null=True) # Длительность
    premiere_date = models.DateField(null=True) # Дата премьеры
    production_team = fields.ArrayField(
        models.CharField(max_length=70),
        blank=True,
        default=list) # Постановочная команда
    
    the_cast = fields.ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list
    ) # Актёрский состав

    description = models.CharField(max_length=2000, null=False)
    afisha = models.BooleanField(default=False) # Если False -> то отображать в разделе "Афиша",
                                                # если True -> то отображать в разделе "Спектакли".
    image_url = models.URLField(null=False, blank=True)
    performances_image = models.URLField(null=True, blank=True) # Изображение для раздела "Спектакли"
    images_list = fields.ArrayField(
        models.URLField(null=True),
        blank=True,
        default=list
    ) # Список фотографий со спектакля для карусели внизу карточки спектакля.
    ticket_url = models.URLField(null=True, blank=True) # Ссылка на покупку билетов.


class Actors(ImageUploadMixin, models.Model):
    class Meta:
        db_table = 'actors'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True, blank=True, default=None)
    name = models.CharField(max_length=50, null=False)
    place_of_work = models.CharField(max_length=200, blank=True) # Место работы
    time_in_theatre = models.CharField(max_length=10, blank=True) # В студии
    favorite_writer = fields.ArrayField(
        models.CharField(max_length=250),
        blank=True,
        default=list
    )

    favorite_character = fields.ArrayField(
      models.CharField(max_length=250),
      blank=True,
      default=list  
    ) # Любимый персонаж

    favorite_painter = fields.ArrayField(
        models.CharField(max_length=350),
        blank=True,
        default=list
    ) # Любимый художник

    favorite_film = fields.ArrayField(
        models.CharField(max_length=250),
        blank=True,
        default=list
    ) # Любимый фильм

    favorite_piece = fields.ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list
    ) # Любимая пьеса

    favorite_quote = models.CharField(max_length=1000, null=False) # Любимая цитата о театре
    author_quote = models.CharField(max_length=50, null=False) # Автор цитаты
    favorite_song = fields.ArrayField(
        models.CharField(max_length=250),
        blank=True,
        default=list
    ) # Любимая песня

    author_song = fields.ArrayField(
        models.CharField(max_length=250),
        blank=True,
        default=list
    ) # Автор песни

    perfomances = fields.ArrayField(
        models.CharField(max_length=100),
        blank=True,
        default=list
    ) # Спектакли

    role_in_perfomances = fields.ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list
    ) # Роли в спектаклях

    image_url = models.URLField(null=False, blank=True)


class DirectorsTheatre(ImageUploadMixin, models.Model): # Режиссёры театра
    class Meta:
        db_table = 'directors_theatre'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    name = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=2000, null=False)
    perfomances = fields.ArrayField(
        models.CharField(max_length=200),
        blank=True,
        default=list
    ) # Поставленные спектакли

    years = fields.ArrayField(
        models.IntegerField(),
        blank=True,
        default=list
    ) # Года, в которые ставились спектакли (на фронте надо приписывать слово "год")

    team_name = fields.ArrayField(
        models.CharField(max_length=300),
        blank=True,
        default=list
    ) # Названия коллективов, учавствующих в спектакле (сделать на фронте выпадающий список, чтобы
      # оттуда можно было выбрать название коллектива или внести свой)

    image_url = models.URLField(null=False, blank=True)


class News(ImageUploadMixin, models.Model):
    class Meta:
        db_table = 'news'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    title = models.CharField(max_length=150, null=False)
    description = models.CharField(max_length=2000, null=False)
    summary = models.CharField(max_length=300, blank=True) # Краткое описание новости
    is_published = models.BooleanField(default=False, blank=True) # Опубликована или нет новость
    image_url = models.URLField(null=False, blank=True)
    date_publish = models.DateField(null=True, blank=True) # Дата публикации новости
    images_list = fields.ArrayField(
        models.URLField(null=True),
        blank=True,
        default=list
    ) # Карусель фотографий для новости.


class Archive(ImageUploadMixin, models.Model): # Архив
    class Meta:
        db_table = 'archive'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    title = models.CharField(max_length=100, null=False)
    description = models.CharField(max_length=2000, null=False)
    age_limit = models.CharField(max_length=5, null=True, blank=True)
    premiere_date = models.DateField(null=True)
    afisha = models.BooleanField(default=True) # Если False -> то нужно отображать в разделе "Архив",
                                                # если True -> то отображать в разделе "Афиша".
    image_url = models.URLField(null=False, blank=True)
    archive_image = models.URLField(null=True, blank=True) # Изображение со спектакля для раздела "Архив".
    images_list = fields.ArrayField(
        models.URLField(null=True),
        blank=True,
        default=list
    ) # Ссылки на изображения со спектаклей.


class Achievements(ImageUploadMixin, models.Model): # Достижения
    class Meta:
        db_table = 'achievements'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    achievement = models.CharField(max_length=500, null=False)
    image_url = models.URLField(null=False, blank=True)
    assigned = models.DateField(null=True, blank=True) # Дата присвоения достижения.
