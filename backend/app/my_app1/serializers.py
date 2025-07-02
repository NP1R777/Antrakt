from rest_framework import serializers
from .models import User, Perfomances


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'deleted_at', 'email', 'phone_number']


class PerfomanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfomances
        fields = '__all__'

