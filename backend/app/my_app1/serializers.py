from rest_framework import serializers
from .models import (User, Perfomances, Actors, DirectorsTheatre,
                     News, Archive, Achievements)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import re


def normalize_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone or "")
    if len(digits) == 11 and digits.startswith("8"):
        digits = "7" + digits[1:]
    return digits


class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['id', 'deleted_at', 'email', 'created_at',
                  'password', 'phone_number', 'is_superuser',
                  'access_token', 'refresh_token']
        extra_kwargs = {
            'email': {'required': False, 'allow_null': True, 'allow_blank': True},
            'phone_number': {'required': False, 'allow_null': True, 'allow_blank': True},
            'password': {'write_only': True},
        }

    def validate(self, attrs):
        email = attrs.get('email')
        phone_number = attrs.get('phone_number')
        if not email and not phone_number:
            raise serializers.ValidationError('Необходимо указать email или номер телефона')
        if phone_number:
            attrs['phone_number'] = normalize_phone(phone_number)
        return attrs

    def create(self, validated_data):
        if validated_data.get('is_superuser'):
            user = User.objects.create_superuser(
                email=validated_data.get('email'),
                password=validated_data['password'],
                phone_number=validated_data.get('phone_number')
        )
        else:
            user = User.objects.create_user(
                email=validated_data.get('email'),
                password=validated_data['password'],
                phone_number=validated_data.get('phone_number')
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
        password = attrs.get('password')
        email = self.initial_data.get('email')
        phone_number_input = self.initial_data.get('phone_number')

        if not password:
            raise serializers.ValidationError('Пароль обязателен')

        user = None
        if email:
            try:
                user = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                pass
        elif phone_number_input:
            normalized_phone = normalize_phone(phone_number_input)
            try:
                user = User.objects.get(phone_number=normalized_phone)
            except User.DoesNotExist:
                pass

        if user is None:
            raise serializers.ValidationError('Неверные учетные данные')

        if not user.check_password(password):
            raise serializers.ValidationError('Неверные учетные данные')

        refresh = RefreshToken.for_user(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
        return data


class PerfomanceSerializer(serializers.ModelSerializer):
    afisha = serializers.BooleanField(default=True)

    class Meta:
        model = Perfomances
        fields = '__all__'


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
