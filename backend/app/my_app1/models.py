from django.db import models
from django.contrib.postgres import fields


class User(models.Model):
    class Meta:
        db_table = 'user'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    email = models.EmailField(unique=True, null=False)
    password = models.CharField(max_length=500, null=False)
    phone_number = models.CharField(max_length=20)


class Perfomances(models.Model): # Спектакли
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
    afisha = models.BooleanField(default=False) # Если False -> то отображать в разделе "Спектакли",
                                                # если True -> то отображать в разделе "Афиша".
    image_url = models.URLField(null=False, blank=True)


class Actors(models.Model):
    class Meta:
        db_table = 'actors'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    name = models.CharField(max_length=50, null=False)
    place_of_work = models.CharField(max_length=200, blank=True) # Место работы
    time_in_theatre = models.CharField(max_length=10, blank=True) # В студии
    favorite_writer = fields.ArrayField(
        models.CharField(max_length=30),
        blank=True,
        default=list
    )

    favorite_character = fields.ArrayField(
      models.CharField(max_length=30),
      blank=True,
      default=list  
    ) # Любимый персонаж

    favorite_painter = fields.ArrayField(
        models.CharField(max_length=30),
        blank=True,
        default=list
    ) # Любимый художник

    favorite_film = fields.ArrayField(
        models.CharField(max_length=50),
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
        models.CharField(max_length=50),
        blank=True,
        default=list
    ) # Любимая песня

    author_song = models.CharField(max_length=30, null=False)
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

    image_url = models.URLField(null=False)


class DirectorsTheatre(models.Model):
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
        models.IntegerField(max_length=4),
        blank=True,
        default=list
    ) # Года, в которые ставились спектакли (на фронте надо приписывать слово "год")

    team_name = fields.ArrayField(
        models.CharField(max_length=300),
        blank=True,
        default=list
    ) # Названия коллективов, учавствующих в спектакле

    image_url = models.URLField(null=False)


class News(models.Model):
    class Meta:
        db_table = 'news'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    title = models.CharField(max_length=150, null=False)
    description = models.CharField(max_length=2000, null=False)
    image_url = models.URLField(null=False)


class Archive(models.Model):
    class Meta:
        db_table = 'archive'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    description = models.CharField(max_length=2000, null=False)
    premiere_date = models.DateField(null=True)
    afisha = models.BooleanField(default=False) # Если False -> то не нужно отображать в разделе "Архив",
                                                # если True -> то отображать в разделе "Афиша".
    image_url = models.URLField(null=False)


class Achievements(models.Model):
    class Meta:
        db_table = 'achievements'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    achievements = fields.ArrayField(
        models.CharField(max_length=500),
        blank=True,
        default=list
    )

    image_url = models.URLField(null=False)
