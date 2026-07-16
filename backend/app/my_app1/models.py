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
    # Коллективы постановки. По умолчанию (в т.ч. при авто-добавлении режиссёру)
    # используется труппа Норильского народного театра, для которого делается сайт.
    COLLECTIVE_NORILSK = 'Труппа норильского народного театра'
    COLLECTIVE_DA = 'Образцовый коллектив театральная студия «ДА»'
    DEFAULT_COLLECTIVE = COLLECTIVE_NORILSK
    COLLECTIVE_CHOICES = [COLLECTIVE_NORILSK, COLLECTIVE_DA]

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
    director_propagated = models.BooleanField(default=False) # Был ли спектакль уже добавлен на страницу
                                                             # режиссёра (отдельный флаг, чтобы работал
                                                             # "докат", если режиссёра задали позже).
    image_url = models.URLField(null=False, blank=True)
    performances_image = models.URLField(null=True, blank=True) # Изображение для раздела "Спектакли"
    images_list = ArrayField(
        models.URLField(null=True),
        blank=True,
        default=list
    ) # Список фотографий со спектакля для карусели внизу карточки спектакля.
    ticket_url = models.URLField(null=True, blank=True) # Ссылка на покупку билетов.
    director = models.ForeignKey(
        'DirectorsTheatre',
        related_name='directed_performances',
        null=True, blank=True,
        on_delete=models.SET_NULL
    ) # Режиссёр спектакля. Имя видно уже в "Афише"; сам спектакль добавляется
      # режиссёру на страницу при переходе в раздел "Спектакли".
    # Если режиссёра нет в базе — имя хранится здесь («Другой(-ая)»).
    guest_director_name = models.CharField(
        max_length=100,
        blank=True,
        default='',
        help_text='Имя режиссёра не из базы («Другой(-ая)»).',
    )
    # Данные для карточки на странице режиссёра (задаются заранее в админке).
    production_title = models.CharField(max_length=200, blank=True, default='')
    # Название постановки; если пусто — берётся название спектакля (title).
    production_collective = models.CharField(max_length=300, blank=True, default='')
    # Коллектив постановки; если пусто — DEFAULT_COLLECTIVE (труппа Норильского театра).
    production_year = models.IntegerField(null=True, blank=True)
    # Год постановки; если пусто — год премьеры / последнего показа / текущий.


class Actors(ImageUploadMixin, models.Model):
    GENDER_MALE = 'male'
    GENDER_FEMALE = 'female'
    GENDER_CHOICES = [
        (GENDER_MALE, 'Актёр'),
        (GENDER_FEMALE, 'Актриса'),
    ]

    class Meta:
        db_table = 'actors'
    
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(null=True)
    deleted_at = models.DateTimeField(null=True, blank=True, default=None)
    name = models.CharField(max_length=50, null=False)
    # NULL = определять автоматически по имени и фамилии; значение задаётся
    # администратором только для ручного исправления.
    gender_override = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        null=True,
        blank=True,
        default=None,
    )
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
    images_list = ArrayField(models.URLField(max_length=500), blank=True, default=list) # Галерея фотографий достижения.
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
    # actor может отсутствовать, если это приглашённый актёр не из базы («Другой(ая)»)
    actor = models.ForeignKey(
        Actors,
        related_name='cast_roles',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    # В составе можно указать и режиссёра театра (он тоже играет роль).
    director = models.ForeignKey(
        'DirectorsTheatre',
        related_name='cast_roles',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    actor_name = models.CharField(max_length=100, blank=True, default='') # Имя актёра не из базы
    role = models.CharField(max_length=100) # Роль актёра в этом спектакле
    created_at = models.DateTimeField(auto_now_add=True)


def sync_performance_cast_to_actors(perf, previous_actor_ids=()):
    """Синхронизировать состав спектакля с карточками актёров.

    Единый источник правды — таблица состава (`PerformanceCast`). Для каждого
    затронутого актёра пары (название спектакля, роль) ИМЕННО этого спектакля
    перезаписываются по актуальному составу: старые записи по этому спектаклю
    удаляются, актуальные — добавляются. Благодаря этому карточка актёра всегда
    отражает то, что задано в спектакле (и наоборот при удалении из состава).

    Роли показываются только для прошедших спектаклей (`afisha=False`); пока
    спектакль в «Афише», состав скрыт, поэтому в карточки актёров он не попадает.
    Приглашённые актёры «Другой(ая)» и режиссёры в массивы актёров не пишутся.

    `previous_actor_ids` — актёры, состоявшие в спектакле до изменения (нужно,
    чтобы убрать роль у тех, кого удалили из состава). Функция идемпотентна.
    """
    title = perf.title
    current = {}
    if not perf.afisha:
        members = (perf.cast_members
                   .filter(actor__isnull=False)
                   .order_by('actor_id', 'id'))
        for m in members:
            current.setdefault(m.actor_id, []).append(m.role)

    affected = set(current.keys()) | set(previous_actor_ids or [])
    for actor_id in affected:
        try:
            actor = Actors.objects.select_for_update().get(pk=actor_id)
        except Actors.DoesNotExist:
            continue
        titles = list(actor.perfomances or [])
        roles = list(actor.role_in_perfomances or [])
        new_titles, new_roles = [], []
        for i, t in enumerate(titles):
            if t == title:
                continue  # убираем все прежние записи по этому спектаклю
            new_titles.append(t)
            new_roles.append(roles[i] if i < len(roles) else '')
        for role in current.get(actor_id, []):
            new_titles.append(title)
            new_roles.append(role)
        actor.perfomances = new_titles
        actor.role_in_perfomances = new_roles
        actor.updated_at = timezone.now()
        actor.save(update_fields=['perfomances', 'role_in_perfomances', 'updated_at'])


def remove_performance_from_director(perf):
    """Remove a propagated performance from the director's parallel arrays."""
    if not perf.director_id or not perf.director_propagated:
        return

    with transaction.atomic():
        try:
            director = DirectorsTheatre.objects.select_for_update().get(
                pk=perf.director_id
            )
        except DirectorsTheatre.DoesNotExist:
            return

        production_title = (perf.production_title or '').strip() or perf.title
        titles = list(director.perfomances or [])
        try:
            index = titles.index(production_title)
        except ValueError:
            return

        years = list(director.years or [])
        teams = list(director.team_name or [])
        titles.pop(index)
        if index < len(years):
            years.pop(index)
        if index < len(teams):
            teams.pop(index)

        director.perfomances = titles
        director.years = years
        director.team_name = teams
        director.updated_at = timezone.now()
        director.save(update_fields=[
            'perfomances', 'years', 'team_name', 'updated_at',
        ])


def sync_actor_roles_to_performances(actor):
    """Синхронизировать массивы ролей актёра с таблицей `PerformanceCast`.

    Источник правды при сохранении карточки актёра — массивы
    `perfomances` / `role_in_perfomances`. Для каждого названия ищем спектакль
    в БД (точное совпадение title) и обновляем строки состава. Спектакли,
    которых нет в базе, пропускаются. Удаление роли у актёра убирает его
    из состава соответствующего спектакля.
    """
    titles = list(actor.perfomances or [])
    roles = list(actor.role_in_perfomances or [])
    desired = {}  # performance_id -> [roles]
    for i, raw_title in enumerate(titles):
        title = (raw_title or '').strip()
        if not title:
            continue
        role = (roles[i] if i < len(roles) else '') or ''
        perfs = Perfomances.objects.filter(title=title, deleted_at__isnull=True)
        perf = perfs.filter(afisha=False).order_by('id').first() \
            or perfs.order_by('id').first()
        if not perf:
            continue
        desired.setdefault(perf.id, []).append(role)

    existing = list(
        PerformanceCast.objects.filter(actor=actor).select_related('performance')
    )
    by_perf = {}
    for row in existing:
        by_perf.setdefault(row.performance_id, []).append(row)

    for perf_id, role_list in desired.items():
        current = {c.role: c for c in by_perf.get(perf_id, [])}
        for role in role_list:
            if role in current:
                current.pop(role)
            else:
                PerformanceCast.objects.get_or_create(
                    performance_id=perf_id,
                    actor=actor,
                    role=role,
                    defaults={
                        'director': None,
                        'actor_name': actor.name or '',
                    },
                )
        for leftover in current.values():
            leftover.delete()

    for perf_id, rows in by_perf.items():
        if perf_id not in desired:
            for row in rows:
                row.delete()


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

        # Спектакль становится прошедшим — состав должен появиться у актёров.
        perf.afisha = False
        perf.roles_propagated = True
        # Билеты больше не нужны: спектакль уже сыгран.
        perf.ticket_url = None

        # Добавляем спектакль режиссёру (на его страницу), однократно и
        # НЕЗАВИСИМО от раздачи ролей актёрам: отдельный флаг director_propagated
        # позволяет «докатить» режиссёра, если его назначили уже после перевода.
        # Название/коллектив/год — из полей спектакля с дефолтами.
        if perf.director_id and not perf.director_propagated:
            director = DirectorsTheatre.objects.select_for_update().get(
                pk=perf.director_id)
            prod_title = (perf.production_title or '').strip() or perf.title
            dir_titles = list(director.perfomances or [])
            if prod_title not in dir_titles:
                dir_years = list(director.years or [])
                dir_teams = list(director.team_name or [])
                if perf.production_year:
                    year = perf.production_year
                elif perf.premiere_date:
                    year = perf.premiere_date.year
                else:
                    last_show = perf.shows.order_by('-show_datetime').first()
                    year = (last_show.show_datetime.year if last_show
                            else timezone.now().year)
                collective = ((perf.production_collective or '').strip()
                              or Perfomances.DEFAULT_COLLECTIVE)
                # Массивы перфомансов/годов/коллективов параллельны по индексу.
                dir_titles.append(prod_title)
                dir_years.append(year)
                dir_teams.append(collective)
                director.perfomances = dir_titles
                director.years = dir_years
                director.team_name = dir_teams
                director.updated_at = timezone.now()
                director.save(update_fields=[
                    'perfomances', 'years', 'team_name', 'updated_at'
                ])
            perf.director_propagated = True

        perf.afisha = False
        perf.updated_at = timezone.now()
        perf.save(update_fields=[
            'afisha', 'roles_propagated', 'director_propagated',
            'ticket_url', 'updated_at',
        ])
        # Ссылки на билеты у отдельных показов тоже очищаем.
        perf.shows.filter(ticket_url__isnull=False).exclude(ticket_url='').update(
            ticket_url=None
        )
        # Единая синхронизация состава с карточками актёров.
        sync_performance_cast_to_actors(perf)
        return perf


def promote_past_performances():
    """Перевести все спектакли, у которых последний показ уже прошёл."""
    from django.db.models import Max

    now = timezone.now()
    candidates = (
        Perfomances.objects
        .filter(afisha=True, deleted_at__isnull=True)
        .annotate(last_show=Max('shows__show_datetime'))
        .filter(last_show__isnull=False, last_show__lte=now)
        .order_by('id')
    )
    promoted = []
    for performance in candidates:
        promoted.append(promote_performance(performance))
    return promoted


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
    deleted_at = models.DateTimeField(null=True, blank=True, default=None) # Мягкое удаление


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


class SiteContent(models.Model): # Редактируемые надписи сайта (мини-CMS)
    class Meta:
        db_table = 'site_content'
        ordering = ['section', 'order', 'id']

    key = models.CharField(max_length=100, unique=True) # уникальный ключ строки
    value = models.TextField(blank=True, default='') # сам текст
    section = models.CharField(max_length=100, blank=True, default='') # группа (Шапка/Футер/...)
    label = models.CharField(max_length=200, blank=True, default='') # человекочитаемое название поля
    multiline = models.BooleanField(default=False) # многострочное ли поле в админке
    order = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key


class BirthdayGreeting(models.Model): # Варианты поздравительного текста
    class Meta:
        db_table = 'birthday_greeting'
        ordering = ['id']

    text = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]


class ActorBirthday(models.Model): # Дни рождения актёров и режиссёров
    class Meta:
        db_table = 'actor_birthday'
        ordering = ['birth_date']
        constraints = [
            # Ровно один именинник: либо актёр, либо режиссёр.
            models.CheckConstraint(
                check=(
                    models.Q(actor__isnull=False, director__isnull=True) |
                    models.Q(actor__isnull=True, director__isnull=False)
                ),
                name='birthday_exactly_one_person'
            ),
        ]

    actor = models.OneToOneField(
        Actors, related_name='birthday', on_delete=models.CASCADE,
        null=True, blank=True
    )
    director = models.OneToOneField(
        'DirectorsTheatre', related_name='birthday', on_delete=models.CASCADE,
        null=True, blank=True
    )
    birth_date = models.DateField() # полная дата; для показа учитываются день и месяц
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def person_name(self):
        if self.actor_id:
            return self.actor.name
        if self.director_id:
            return self.director.name
        return ''

    @property
    def person_image(self):
        if self.actor_id:
            return self.actor.image_url
        if self.director_id:
            return self.director.image_url
        return ''

    def __str__(self):
        return f'{self.person_name}: {self.birth_date}'


class SiteReview(models.Model): # Отзывы для секции на главной (парсятся из ВК + ручные)
    class Meta:
        db_table = 'site_review'
        ordering = ['-review_date', '-id']
        constraints = [
            # Один и тот же комментарий ВК не дублируется.
            models.UniqueConstraint(
                fields=['vk_owner_id', 'vk_post_id', 'vk_comment_id'],
                condition=models.Q(vk_comment_id__isnull=False),
                name='uniq_vk_comment'
            ),
        ]

    author_name = models.CharField(max_length=200)      # Фамилия и имя
    role = models.CharField(max_length=120, blank=True, default='Зритель')
    avatar_url = models.URLField(max_length=500, blank=True, default='')
    rating = models.PositiveSmallIntegerField(default=5)
    text = models.TextField()
    review_date = models.DateField(null=True, blank=True)  # дата отзыва
    source_url = models.URLField(max_length=500, blank=True, default='')
    source = models.CharField(max_length=20, default='vk')  # 'vk' | 'manual'
    vk_owner_id = models.BigIntegerField(null=True, blank=True)
    vk_post_id = models.BigIntegerField(null=True, blank=True)
    vk_comment_id = models.BigIntegerField(null=True, blank=True)
    pinned = models.BooleanField(default=False)   # админ закрепил в секции
    hidden = models.BooleanField(default=False)   # админ убрал из секции
    position = models.IntegerField(default=0)     # порядок закреплённых
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.author_name}: {self.text[:40]}'


class VkParserState(models.Model): # Состояние парсера отзывов ВК (singleton)
    class Meta:
        db_table = 'vk_parser_state'

    initial_done = models.BooleanField(default=False)  # первый полный проход выполнен
    last_run_at = models.DateTimeField(null=True, blank=True)
    last_result = models.CharField(max_length=500, blank=True, default='')

    @classmethod
    def get_solo(cls):
        obj = cls.objects.first()
        if not obj:
            obj = cls.objects.create()
        return obj
