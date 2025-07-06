from rest_framework import serializers
from .models import (User, Perfomances, Actors, DirectorsTheatre,
                     News, Archive, Achievements)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'deleted_at', 'email', 'password', 'phone_number']


    def create(self, validated_date):
        user = User.objects.create_user(
            email=validated_date.get('email', ''),
            phone_number=validated_date['phone_number'],
            password=validated_date['password']
        )

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['phone_number'] = user.phone_number
        return token


class PerfomanceSerializer(serializers.ModelSerializer):
    afisha = serializers.BooleanField(default=False)

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
