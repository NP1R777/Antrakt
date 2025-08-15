from rest_framework import serializers
from .models import (User, Perfomances, Actors, DirectorsTheatre,
                     News, Archive, Achievements)


class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['id', 'deleted_at', 'email', 'created_at',
                  'password', 'phone_number', 'is_superuser']
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
