from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
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

