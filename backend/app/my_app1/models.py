from django.db import models, transaction
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from .mixins import ImageUploadMixin
from django.conf import settings

# Условный импорт PostgreSQL полей
try:
    from django.contrib.postgres import fields as postgres_fields
    # Проверяем, используется ли PostgreSQL
    if 'postgresql' in settings.DATABASES['default']['ENGINE']:
        ArrayField = postgres_fields.ArrayField
        USE_POSTGRES_FIELDS = True
    else:
        # Для SQLite используем JSONField как fallback
        ArrayField = models.JSONField
        USE_POSTGRES_FIELDS = False
except ImportError:
    # Fallback на JSONField если PostgreSQL недоступен
    ArrayField = models.JSONField
    USE_POSTGRES_FIELDS = False


class CustomUserManager(BaseUserManager):
    def create_user(self, password, email=None, phone_number=None, **extra_fields):
        if not email and not phone_number:
            raise ValueError('Пользователь должен иметь email или номер телефона')
        
        email_normalized = self.normalize_email(email) if email else None
        user = self.model(
            email=email_normalized,
            phone_number=phone_number,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    

    def create_superuser(self, password, email=None, phone_number=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Суперпользователь должен иметь is_superuser=True')
        
        # Для суперпользователя обычно требуется email, но позволим и телефон
        return self.create_user(password=password, email=email, phone_number=phone_number, **extra_fields)


class User(AbstractBaseUser):
    class Meta:
        db_table = 'user'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True, default=None, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    password = models.CharField(max_length=500, null=False)
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    profile_photo = models.URLField(null=False, blank=True)
    access_token = models.CharField(max_length=500, blank=True, null=True)
    refresh_token = models.CharField(max_length=500, blank=True, null=True)

    # Оставляем email в качестве USERNAME_FIELD для совместимости с админкой
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
    production_team = ArrayField(
        models.CharField(max_length=70),
        blank=True,
        default=list) # Постановочная команда
    
    description = models.CharField(max_length=2000, null=False)
    afisha = models.BooleanField(default=True) # Если True -> отображать в разделе "Афиша",
                                               # если False -> отображать в разделе "Спектакли".
    roles_propagated = models.BooleanField(default=False) # Были ли роли из состава уже добавлены
                                                          # на страницы актёров (однократно при переходе
                                                          # спектакля в раздел "Спектакли").
    image_url = models.URLField(null=False, blank=True)
    performances_image = models.URLField(null=True, blank=True) # Изображение для раздела "Спектакли"
    images_list = ArrayField(
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
    joined_at = models.DateField(null=True, blank=True) # Когда актёр пришёл в театр (год+месяц)
    left_at = models.DateField(null=True, blank=True) # Когда актёр выбыл (null = активный)
    favorite_writer = ArrayField(
        models.CharField(max_length=250),
        blank=True,
        default=list
    )

    favorite_character = ArrayField(
      models.CharField(max_length=250),
      blank=True,
      default=list  
    ) # Любимый персонаж

    favorite_painter = ArrayField(
        models.CharField(max_length=350),
        blank=True,
        default=list
    ) # Любимый художник

    favorite_film = ArrayField(
        models.CharField(max_length=250),
        blank=True,
        default=list
    ) # Любимый фильм

    favorite_piece = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list
    ) # Любимая пьеса

    favorite_quote = models.CharField(max_length=1000, null=False) # Любимая цитата о театре
    author_quote = models.CharField(max_length=50, null=False) # Автор цитаты
    favorite_song = ArrayField(
        models.CharField(max_length=250),
        blank=True,
        default=list
    ) # Любимая песня

    author_song = ArrayField(
        models.CharField(max_length=250),
        blank=True,
        default=list
    ) # Автор песни

    perfomances = ArrayField(
        models.CharField(max_length=100),
        blank=True,
        default=list
    ) # Спектакли

    role_in_perfomances = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list
    ) # Роли в спектаклях

    image_url = models.URLField(null=False, blank=True)

    @property
    def is_active(self):
        """Активный актёр — тот, у кого не проставлена дата ухода."""
        return self.left_at is None

    @property
    def years_in_theatre(self):
        """Число полных лет в студии, вычисляется от даты прихода.

        Для выбывших актёров счётчик «замораживается» на дате ухода (left_at),
        иначе считается до сегодняшнего дня (в таймзоне театра).
        """
        if not self.joined_at:
            return 0
        end = self.left_at or timezone.localdate()
        years = end.year - self.joined_at.year
        if (end.month, end.day) < (self.joined_at.month, self.joined_at.day):
            years -= 1
        return max(years, 0)


class DirectorsTheatre(ImageUploadMixin, models.Model): # Режиссёры театра
    class Meta:
        db_table = 'directors_theatre'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True)
    name = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=2000, null=False)
    perfomances = ArrayField(
        models.CharField(max_length=200),
        blank=True,
        default=list
    ) # Поставленные спектакли

    years = ArrayField(
        models.IntegerField(),
        blank=True,
        default=list
    ) # Года, в которые ставились спектакли (на фронте надо приписывать слово "год")

    team_name = ArrayField(
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
    images_list = ArrayField(
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
    images_list = ArrayField(
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


class PerformanceShow(models.Model): # Показы спектакля (несколько дат и времён)
    class Meta:
        db_table = 'performance_show'
        ordering = ['show_datetime']

    performance = models.ForeignKey(
        Perfomances,
        related_name='shows',
        on_delete=models.CASCADE
    )
    show_datetime = models.DateTimeField() # Дата и время конкретного показа (tz-aware)
    ticket_url = models.URLField(null=True, blank=True) # Ссылка на покупку билетов для этого показа
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PerformanceCast(models.Model): # Состав спектакля: актёр + его роль
    class Meta:
        db_table = 'performance_cast'
        unique_together = ('performance', 'actor', 'role')
        ordering = ['id']

    performance = models.ForeignKey(
        Perfomances,
        related_name='cast_members',
        on_delete=models.CASCADE
    )
    actor = models.ForeignKey(
        Actors,
        related_name='cast_roles',
        on_delete=models.CASCADE
    )
    role = models.CharField(max_length=100) # Роль актёра в этом спектакле
    created_at = models.DateTimeField(auto_now_add=True)


def promote_performance(performance):
    """Перевести спектакль из раздела «Афиша» в раздел «Спектакли».

    При первом переходе однократно добавляет роли из состава (`PerformanceCast`)
    на страницы соответствующих актёров (в массивы `perfomances` /
    `role_in_perfomances`). Функция идемпотентна и безопасна при параллельных
    вызовах: запись спектакля и записи актёров блокируются через
    `select_for_update`, а повторное добавление одной и той же пары
    (спектакль, роль) исключается.

    Возвращает обновлённый объект спектакля.
    """
    with transaction.atomic():
        perf = Perfomances.objects.select_for_update().get(pk=performance.pk)

        if not perf.afisha and perf.roles_propagated:
            # Уже переведён и роли разданы — ничего не делаем.
            return perf

        if not perf.roles_propagated:
            cast = (perf.cast_members
                    .select_related('actor')
                    .order_by('actor_id', 'id'))
            for member in cast:
                actor = Actors.objects.select_for_update().get(pk=member.actor_id)
                titles = list(actor.perfomances or [])
                roles = list(actor.role_in_perfomances or [])
                pair_exists = any(
                    title == perf.title
                    and (roles[i] if i < len(roles) else None) == member.role
                    for i, title in enumerate(titles)
                )
                if not pair_exists:
                    titles.append(perf.title)
                    roles.append(member.role)
                    actor.perfomances = titles
                    actor.role_in_perfomances = roles
                    actor.updated_at = timezone.now()
                    actor.save(update_fields=[
                        'perfomances', 'role_in_perfomances', 'updated_at'
                    ])
            perf.roles_propagated = True

        perf.afisha = False
        perf.updated_at = timezone.now()
        perf.save(update_fields=['afisha', 'roles_propagated', 'updated_at'])
        return perf


class Review(models.Model): # Отзыв пользователя о спектакле или актёре
    MAX_REACTIONS_PER_USER = 3 # Не более 3 разных реакций от одного пользователя на отзыв

    class Meta:
        db_table = 'review'
        ordering = ['-created_at']
        constraints = [
            # У отзыва ровно одна цель: спектакль, актёр, режиссёр,
            # архивное мероприятие или новость.
            models.CheckConstraint(
                check=(
                    models.Q(performance__isnull=False, actor__isnull=True,
                             director__isnull=True, archive__isnull=True, news__isnull=True) |
                    models.Q(performance__isnull=True, actor__isnull=False,
                             director__isnull=True, archive__isnull=True, news__isnull=True) |
                    models.Q(performance__isnull=True, actor__isnull=True,
                             director__isnull=False, archive__isnull=True, news__isnull=True) |
                    models.Q(performance__isnull=True, actor__isnull=True,
                             director__isnull=True, archive__isnull=False, news__isnull=True) |
                    models.Q(performance__isnull=True, actor__isnull=True,
                             director__isnull=True, archive__isnull=True, news__isnull=False)
                ),
                name='review_exactly_one_target',
            ),
        ]

    author = models.ForeignKey(
        'User', related_name='reviews', on_delete=models.CASCADE
    )
    performance = models.ForeignKey(
        Perfomances, related_name='reviews', null=True, blank=True,
        on_delete=models.CASCADE
    )
    actor = models.ForeignKey(
        Actors, related_name='reviews', null=True, blank=True,
        on_delete=models.CASCADE
    )
    director = models.ForeignKey(
        DirectorsTheatre, related_name='reviews', null=True, blank=True,
        on_delete=models.CASCADE
    )
    archive = models.ForeignKey(
        Archive, related_name='reviews', null=True, blank=True,
        on_delete=models.CASCADE
    )
    news = models.ForeignKey(
        News, related_name='reviews', null=True, blank=True,
        on_delete=models.CASCADE
    )
    text = models.TextField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ReviewReaction(models.Model): # Реакция пользователя на отзыв
    HEART = 'heart'
    LIKE = 'like'
    LAUGH = 'laugh'
    WOW = 'wow'
    SAD = 'sad'
    REACTION_CHOICES = [
        (HEART, '❤️'),
        (LIKE, '👍'),
        (LAUGH, '😂'),
        (WOW, '😮'),
        (SAD, '😢'),
    ]

    class Meta:
        db_table = 'review_reaction'
        unique_together = ('review', 'user', 'reaction')

    review = models.ForeignKey(
        Review, related_name='reactions', on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        'User', related_name='review_reactions', on_delete=models.CASCADE
    )
    reaction = models.CharField(max_length=10, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


class EmailVerification(models.Model): # Код подтверждения email при регистрации
    CODE_TTL_MINUTES = 10       # срок жизни кода
    MAX_ATTEMPTS = 5            # максимум попыток ввода кода
    RESEND_COOLDOWN_SECONDS = 30  # минимальный интервал между отправками кода

    class Meta:
        db_table = 'email_verification'

    email = models.EmailField(unique=True)
    code = models.CharField(max_length=6)
    # Пароль будущего пользователя хранится уже захешированным.
    password = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    attempts = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    last_sent_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() >= self.expires_at
