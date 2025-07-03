from .models import *
from datetime import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, PerfomanceSerializer


class UserList(APIView):
    model_class = User
    serializer_class = UserSerializer

    def get(self, request, format=None):
        users = self.model_class.objects.filter(deleted_at=None)
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data)


class PefomancesList(APIView):
    model_class = Perfomances
    serializer_class = PerfomanceSerializer
    
    def get(self, request, format=None):
        perfomances = self.model_class.objects.filter(deleted_at=None,
                                                      afisha=False)
        serializer = self.serializer_class(perfomances, many=True)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=PerfomanceSerializer)
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            perfomance = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=PerfomanceSerializer)
    def put(self, id, request, format=None):
        perfomance = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(perfomance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, id, request, format=None):
        perfomance = get_object_or_404(self.model_class, id=id)
        perfomance.deleted_at = datetime.now()
        perfomance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
