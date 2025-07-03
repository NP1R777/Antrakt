from .models import User, Perfomances
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'deleted_at', 'email', 'phone_number']


class PerfomanceSerializer(serializers.ModelSerializer):
    afisha = serializers.BooleanField(default=False)

    class Meta:
        model = Perfomances
        fields = '__all__'
