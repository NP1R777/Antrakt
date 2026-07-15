from rest_framework import serializers
from django.db import transaction
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import (User, Perfomances, Actors, DirectorsTheatre,
                     News, Archive, Achievements,
                     PerformanceShow, PerformanceCast,
                     Review, ReviewReaction,
                     SiteContent, BirthdayGreeting, ActorBirthday,
                     SiteReview,
                     sync_performance_cast_to_actors,
                     sync_actor_roles_to_performances)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(default=False)

    class Meta:
        model = User
        # ВНИМАНИЕ: access_token / refresh_token намеренно НЕ отдаём наружу.
        fields = ['id', 'deleted_at', 'email', 'created_at',
                  'password', 'phone_number', 'is_superuser', 'profile_photo']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        # На частичном обновлении (например, восстановление пользователя —
        # передаётся только deleted_at) берём недостающие значения из уже
        # сохранённого объекта, иначе валидация ломала бы restore/soft-delete.
        email = attrs.get('email', getattr(self.instance, 'email', None))
        phone_number = attrs.get('phone_number', getattr(self.instance, 'phone_number', None))
        if not email and not phone_number:
            raise serializers.ValidationError("Требуется email или номер телефона")
        return attrs

    def create(self, validated_data):
        is_superuser = validated_data.pop('is_superuser', False)
        password = validated_data.pop('password')
        email = validated_data.pop('email', None)
        phone_number = validated_data.pop('phone_number', None)

        if is_superuser:
            user = User.objects.create_superuser(
                password=password,
                email=email,
                phone_number=phone_number,
                **validated_data
            )
        else:
            user = User.objects.create_user(
                password=password,
                email=email,
                phone_number=phone_number,
                **validated_data
            )
        return user

    def update(self, instance, validated_data):
        # Пароль хешируем, а не сохраняем в открытом виде.
        password = validated_data.pop('password', None)
        validated_data.pop('is_superuser', None)  # роль через этот эндпоинт не меняем
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    """Регистрация обычного пользователя. Email обязателен, роль всегда обычная."""
    email = serializers.EmailField(required=True, allow_blank=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True},
            'phone_number': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def validate_phone_number(self, value):
        if value and User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Пользователь с таким телефоном уже существует")
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages))
        return value

    def create(self, validated_data):
        # Регистрация всегда создаёт обычного пользователя (никогда не админа).
        return User.objects.create_user(
            password=validated_data['password'],
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number') or None,
        )


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages))
        return value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['phone_number'] = user.phone_number
        return token

    def validate(self, attrs):
        # Поддерживаем вход по email или номеру телефона
        email = attrs.get('email')
        password = attrs.get('password')
        phone_number = self.initial_data.get('phone_number')

        if phone_number and not email:
            try:
                user = User.objects.get(phone_number=phone_number)
            except User.DoesNotExist:
                raise serializers.ValidationError("Неверные учетные данные")

            if not user.check_password(password):
                raise serializers.ValidationError("Неверные учетные данные")

            data = {}
            refresh = self.get_token(user)
            data['refresh'] = str(refresh)
            data['access'] = str(refresh.access_token)
            return data

        # По умолчанию поведение как у стандартного сериализатора (вход по email)
        return super().validate(attrs)


class PerformanceShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceShow
        fields = ['id', 'show_datetime', 'ticket_url']


class PerformanceCastSerializer(serializers.ModelSerializer):
    # Роль может исполнять: актёр из базы, режиссёр из базы либо приглашённый
    # актёр «Другой(ая)» (только имя, actor_name).
    actor = serializers.PrimaryKeyRelatedField(
        queryset=Actors.objects.all(), required=False, allow_null=True
    )
    director = serializers.PrimaryKeyRelatedField(
        queryset=DirectorsTheatre.objects.all(), required=False, allow_null=True
    )
    actor_name = serializers.CharField(required=False, allow_blank=True)
    actor_image = serializers.SerializerMethodField()

    class Meta:
        model = PerformanceCast
        fields = ['id', 'actor', 'director', 'actor_name', 'actor_image', 'role']

    def get_actor_image(self, obj):
        if obj.actor_id:
            return obj.actor.image_url
        if obj.director_id:
            return obj.director.image_url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Имя показываем из связанной записи (актёр/режиссёр), иначе — свободный текст.
        if instance.actor_id:
            data['actor_name'] = instance.actor.name
        elif instance.director_id:
            data['actor_name'] = instance.director.name
        return data

    def validate(self, attrs):
        actor = attrs.get('actor')
        director = attrs.get('director')
        actor_name = (attrs.get('actor_name') or '').strip()
        if not actor and not director and not actor_name:
            raise serializers.ValidationError(
                'Нужно выбрать актёра/режиссёра или указать имя.'
            )
        return attrs


class PerfomanceSerializer(serializers.ModelSerializer):
    afisha = serializers.BooleanField(default=True)
    shows = PerformanceShowSerializer(many=True, required=False)
    cast = PerformanceCastSerializer(many=True, required=False, source='cast_members')
    # Имя режиссёра видно всегда (в т.ч. когда спектакль в "Афише").
    director_name = serializers.SerializerMethodField()

    class Meta:
        model = Perfomances
        fields = '__all__'

    def get_director_name(self, obj):
        if obj.director_id:
            return obj.director.name
        name = (getattr(obj, 'guest_director_name', None) or '').strip()
        return name or None

    def _is_admin(self):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        return bool(user and user.is_authenticated and user.is_superuser)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Состав и роли скрыты от обычных пользователей, пока спектакль в "Афише".
        # Администраторам (для редактирования в админке) состав отдаём всегда.
        if instance.afisha and not self._is_admin():
            data['cast'] = []
        return data

    def _sync_shows(self, performance, shows_data):
        for show in shows_data:
            PerformanceShow.objects.create(performance=performance, **show)

    def _sync_cast(self, performance, cast_data):
        for member in cast_data:
            PerformanceCast.objects.create(performance=performance, **member)

    def create(self, validated_data):
        shows_data = validated_data.pop('shows', [])
        cast_data = validated_data.pop('cast_members', [])
        # Если выбран режиссёр из базы — гостевое имя не нужно.
        if validated_data.get('director') is not None:
            validated_data['guest_director_name'] = ''
        with transaction.atomic():
            performance = Perfomances.objects.create(**validated_data)
            self._sync_shows(performance, shows_data)
            self._sync_cast(performance, cast_data)
            # Синхронизируем состав с карточками актёров (для afisha=False).
            sync_performance_cast_to_actors(performance)
        return performance

    def update(self, instance, validated_data):
        shows_data = validated_data.pop('shows', None)
        cast_data = validated_data.pop('cast_members', None)
        if 'director' in validated_data and validated_data.get('director') is not None:
            validated_data['guest_director_name'] = ''
        with transaction.atomic():
            # Актёры, состоявшие в спектакле до изменения, — чтобы корректно
            # убрать роль у тех, кого удалили из состава.
            previous_actor_ids = list(
                instance.cast_members.filter(actor__isnull=False)
                .values_list('actor_id', flat=True)
            )
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            # Полная замена дочерних записей при их наличии в запросе.
            if shows_data is not None:
                instance.shows.all().delete()
                self._sync_shows(instance, shows_data)
            if cast_data is not None:
                instance.cast_members.all().delete()
                self._sync_cast(instance, cast_data)
            sync_performance_cast_to_actors(instance, previous_actor_ids)
        return instance


class ActorsSerializer(serializers.ModelSerializer):
    deleted_at = serializers.DateTimeField(required=False, allow_null=True, default=None)
    # Вычисляемые поля: стаж в студии считается из joined_at/left_at.
    time_in_theatre = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Actors
        fields = '__all__'

    def get_time_in_theatre(self, obj):
        return str(obj.years_in_theatre)

    def get_is_active(self, obj):
        return obj.is_active

    def create(self, validated_data):
        with transaction.atomic():
            actor = Actors.objects.create(**validated_data)
            sync_actor_roles_to_performances(actor)
        return actor

    def update(self, instance, validated_data):
        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            # Если менялись роли/спектакли — синхронизируем состав спектаклей.
            if ('perfomances' in validated_data
                    or 'role_in_perfomances' in validated_data):
                sync_actor_roles_to_performances(instance)
        return instance


class DirectorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectorsTheatre
        fields = '__all__'


class NewsSerializer(serializers.ModelSerializer):
    is_published = serializers.BooleanField(default=False)

    class Meta:
        model = News
        fields = '__all__'


class ArchiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Archive
        fields = '__all__'


class AchievementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievements
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_photo = serializers.CharField(source='author.profile_photo', read_only=True)
    author_email = serializers.SerializerMethodField()
    reactions = serializers.SerializerMethodField()
    my_reactions = serializers.SerializerMethodField()
    subject_title = serializers.SerializerMethodField()
    subject_type = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'author', 'author_name', 'author_photo', 'author_email',
                  'performance', 'actor', 'director', 'archive', 'news',
                  'subject_title', 'subject_type',
                  'text', 'created_at', 'reactions', 'my_reactions']
        read_only_fields = ['author', 'performance', 'actor', 'director',
                            'archive', 'news', 'created_at']

    def get_subject_title(self, obj):
        if obj.performance_id:
            return obj.performance.title
        if obj.actor_id:
            return obj.actor.name
        if obj.director_id:
            return obj.director.name
        if obj.archive_id:
            return obj.archive.title
        if obj.news_id:
            return obj.news.title
        return None

    def get_subject_type(self, obj):
        if obj.performance_id:
            return 'performance'
        if obj.actor_id:
            return 'actor'
        if obj.director_id:
            return 'director'
        if obj.archive_id:
            return 'archive'
        if obj.news_id:
            return 'news'
        return None

    def _current_user(self):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            return user
        return None

    def get_author_name(self, obj):
        email = obj.author.email or ''
        if email:
            return email.split('@')[0]
        return obj.author.phone_number or 'Пользователь'

    def get_author_email(self, obj):
        # Полный email автора виден только администратору (для связи/предупреждений).
        user = self._current_user()
        if user and user.is_superuser:
            return obj.author.email
        return None

    def get_reactions(self, obj):
        counts = {}
        for r in obj.reactions.all():
            counts[r.reaction] = counts.get(r.reaction, 0) + 1
        return [{'reaction': k, 'count': v} for k, v in sorted(counts.items())]

    def get_my_reactions(self, obj):
        user = self._current_user()
        if not user:
            return []
        return [r.reaction for r in obj.reactions.all() if r.user_id == user.id]


class ReviewReactionSerializer(serializers.Serializer):
    reaction = serializers.ChoiceField(choices=ReviewReaction.REACTION_CHOICES)


class SiteReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteReview
        fields = ['id', 'author_name', 'role', 'avatar_url', 'rating', 'text',
                  'review_date', 'source_url', 'source', 'pinned', 'hidden',
                  'position', 'created_at']
        read_only_fields = ['id', 'source', 'created_at']


class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = ['id', 'key', 'value', 'section', 'label', 'multiline', 'order']
        # Ключи/группы задаются в коде; через API меняется только текст.
        read_only_fields = ['id', 'key', 'section', 'label', 'multiline', 'order']


class BirthdayGreetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirthdayGreeting
        fields = ['id', 'text', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class ActorBirthdaySerializer(serializers.ModelSerializer):
    # Именинником может быть актёр или режиссёр.
    actor = serializers.PrimaryKeyRelatedField(
        queryset=Actors.objects.all(), required=False, allow_null=True
    )
    director = serializers.PrimaryKeyRelatedField(
        queryset=DirectorsTheatre.objects.all(), required=False, allow_null=True
    )
    person_name = serializers.CharField(read_only=True)
    person_image = serializers.CharField(read_only=True)
    # Обратная совместимость: actor_name/actor_image = имя/фото именинника.
    actor_name = serializers.CharField(source='person_name', read_only=True)
    actor_image = serializers.CharField(source='person_image', read_only=True)

    class Meta:
        model = ActorBirthday
        fields = ['id', 'actor', 'director', 'person_name', 'person_image',
                  'actor_name', 'actor_image', 'birth_date']

    def validate(self, attrs):
        # На create — ровно один из actor/director; на partial update допускаем отсутствие.
        actor = attrs.get('actor', getattr(self.instance, 'actor', None))
        director = attrs.get('director', getattr(self.instance, 'director', None))
        if bool(actor) == bool(director):
            raise serializers.ValidationError(
                'Укажите ровно одного именинника: актёра ИЛИ режиссёра.'
            )
        return attrs
