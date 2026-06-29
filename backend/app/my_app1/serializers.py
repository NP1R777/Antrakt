from rest_framework import serializers
from django.db import transaction
from .models import (User, Perfomances, Actors, DirectorsTheatre,
                     News, Archive, Achievements,
                     PerformanceShow, PerformanceCast)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['id', 'deleted_at', 'email', 'created_at',
                  'password', 'phone_number', 'is_superuser',
                  'access_token', 'refresh_token']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        email = attrs.get('email')
        phone_number = attrs.get('phone_number')
        if not email and not phone_number:
            raise serializers.ValidationError("Требуется email или номер телефона")
        return attrs

    def create(self, validated_data):
        is_superuser = validated_data.pop('is_superuser', False)
        password = validated_data.pop('password')
        email = validated_data.get('email')
        phone_number = validated_data.get('phone_number')

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
    actor_name = serializers.CharField(source='actor.name', read_only=True)
    actor_image = serializers.URLField(source='actor.image_url', read_only=True)

    class Meta:
        model = PerformanceCast
        fields = ['id', 'actor', 'actor_name', 'actor_image', 'role']


class PerfomanceSerializer(serializers.ModelSerializer):
    afisha = serializers.BooleanField(default=True)
    shows = PerformanceShowSerializer(many=True, required=False)
    cast = PerformanceCastSerializer(many=True, required=False, source='cast_members')

    class Meta:
        model = Perfomances
        fields = '__all__'

    def _is_admin(self):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        return bool(user and user.is_authenticated and user.is_superuser)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Состав и роли скрыты от обычных пользователей, пока спектакль в "Афише".
        # Администраторам (для редактирования) состав отдаём всегда.
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
        with transaction.atomic():
            performance = Perfomances.objects.create(**validated_data)
            self._sync_shows(performance, shows_data)
            self._sync_cast(performance, cast_data)
        return performance

    def update(self, instance, validated_data):
        shows_data = validated_data.pop('shows', None)
        cast_data = validated_data.pop('cast_members', None)
        with transaction.atomic():
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
        return instance


class ActorsSerializer(serializers.ModelSerializer):
    deleted_at = serializers.DateTimeField(required=False, allow_null=True, default=None)

    class Meta:
        model = Actors
        fields = '__all__'


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
