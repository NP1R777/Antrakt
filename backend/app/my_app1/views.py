from .models import *
from itertools import chain
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404
from rest_framework.decorators import permission_classes
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import (UserSerializer, PerfomanceSerializer, ActorsSerializer,
                          DirectorsSerializer, NewsSerializer, ArchiveSerializer,
                          AchievementsSerializer, CustomTokenObtainPairSerializer)
from .minio_utils import upload_image_to_minio, delete_image_from_minio


class UserList(APIView):
    model_class = User
    serializer_class = UserSerializer


    def get(self, request, format=None):
        users = self.model_class.objects.filter(deleted_at=None).order_by('id')
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data)


class UserListAdmin(APIView):
    model_class = User
    serializer_class = UserSerializer


    def get(self, request, format=None):
        users = self.model_class.objects.order_by('id')
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data)


class UserDetail(APIView):
    model_class = User
    serializer_class = UserSerializer

    
    def get(self, request, id, format=None):
        user = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(user)
        return Response(serializer.data)
    
    
    @swagger_auto_schema(request_body=UserSerializer)
    def put(self, request, id, format=None):
        user = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, id, format=None):
        user = get_object_or_404(self.model_class, id=id)
        user.deleted_at = datetime.now()
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user).data,
            "message": "Пользователь создан!"
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Сохраняем токены в базе для пользователя
            email = request.data.get('email')
            try:
                user = User.objects.get(email=email)
                user.access_token = response.data['access']
                user.refresh_token = response.data['refresh']
                user.save()
            except User.DoesNotExist:
                pass
                
        return response


class CustomTokenRefreshView(TokenRefreshView):
    """
    Кастомный view для обновления токенов
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Обновляем access_token в базе
            refresh_token = request.data.get('refresh')
            try:
                # Декодируем refresh токен чтобы получить user_id
                token = RefreshToken(refresh_token)
                user_id = token.payload.get('user_id')
                user = User.objects.get(id=user_id)
                user.access_token = response.data['access']
                # Если есть новый refresh токен (при ROTATE_REFRESH_TOKENS=True)
                if 'refresh' in response.data:
                    user.refresh_token = response.data['refresh']
                user.save()
            except Exception:
                pass
                
        return response


class LogoutView(APIView):
    """
    Выход из системы с добавлением токена в blacklist
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Очищаем токены из базы пользователя
            user = request.user
            user.access_token = None
            user.refresh_token = None
            user.save()
            
            return Response(
                {"message": "Успешный выход из системы"}, 
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": "Ошибка при выходе из системы"}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class VerifyTokenView(APIView):
    """
    Проверка действительности токена
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({
            "valid": True,
            "user": {
                "id": request.user.id,
                "email": request.user.email,
                "phone_number": request.user.phone_number,
                "is_superuser": request.user.is_superuser
            }
        })


class PefomancesList(APIView):
    model_class = Perfomances
    serializer_class = PerfomanceSerializer
    

    def get(self, request, format=None):
        perfomances = self.model_class.objects.filter(deleted_at=None,
                                                      afisha=False).order_by('premiere_date')
        serializer = self.serializer_class(perfomances, many=True)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=PerfomanceSerializer)
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PerfomancesListAdmin(APIView):
    model_class = Perfomances
    serializer_class = PerfomanceSerializer


    def get(self, request, format=None):
        perfomances = self.model_class.objects.order_by('id')
        serializer = self.serializer_class(perfomances, many=True)
        return Response(serializer.data)


class PerfomanceDetail(APIView):
    model_class = Perfomances
    serializer_class = PerfomanceSerializer


    def get(self, request, id, format=None):
        perfomance = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(perfomance)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=PerfomanceSerializer)
    def put(self, request, id, format=None):
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


class ActorsList(APIView):
    model_class = Actors
    serializer_class = ActorsSerializer


    def get(self, request, format=None):
        actors = self.model_class.objects.filter(deleted_at=None).order_by('id')
        serializer = self.serializer_class(actors, many=True)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=ActorsSerializer)
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            actor = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActorsListAdmin(APIView):
    model_class = Actors
    serializer_class = ActorsSerializer


    def get(self, request, format=None):
        actors = self.model_class.objects.order_by('id')
        serializer = self.serializer_class(actors, many=True)
        return Response(serializer.data)


class ActorDetail(APIView):
    model_class = Actors
    serializer_class = ActorsSerializer


    def get(self, request, id, format=None):
        actor = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(actor)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=ActorsSerializer)
    def put(self, request, id, format=None):
        actor = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(actor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id, format=None):
        actor = get_object_or_404(self.model_class, id=id)
        actor.deleted_at = datetime.now()
        actor.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DirectorsList(APIView):
    model_class = DirectorsTheatre
    serializer_class = DirectorsSerializer


    def get(self, request, format=None):
        directors = self.model_class.objects.filter(deleted_at=None)
        serializer = self.serializer_class(directors, many=True)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=DirectorsSerializer)
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DirectorsListAdmin(APIView):
    model_class = DirectorsTheatre
    serializer_class = DirectorsSerializer


    def get(self, request, format=None):
        directors = self.model_class.objects.order_by('id')
        serializer = self.serializer_class(directors, many=True)
        return Response(serializer.data)


class DirectorDetail(APIView):
    model_class = DirectorsTheatre
    serializer_class = DirectorsSerializer


    def get(self, request, id, format=None):
        directors = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(directors)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=DirectorsSerializer)
    def put(self, request, id, format=None):
        director = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(director, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, id, format=None):
        director = get_object_or_404(self.model_class, id=id)
        director.deleted_at = datetime.now()
        director.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NewsList(APIView):
    model_class = News
    serializer_class = NewsSerializer


    def get(self, request, format=None):
        news = self.model_class.objects.filter(deleted_at=None,
                                               is_published=True)
        serializer = self.serializer_class(news, many=True)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=NewsSerializer)
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsListAdmin(APIView):
    model_class = News
    serializer_class = NewsSerializer


    def get(self, request, format=None):
        news = self.model_class.objects.order_by('id')
        serializer = self.serializer_class(news, many=True)
        return Response(serializer.data)


class NewsDetail(APIView):
    model_class = News
    serializer_class = NewsSerializer


    def get(self, request, id, format=None):
        news = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(news)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=NewsSerializer)
    def put(self, request, id, format=None):
        news = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(news, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, id, format=None):
        news = get_object_or_404(self.model_class, id=id)
        news.deleted_at = datetime.now()
        news.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ArchiveList(APIView):
    model_class = Archive
    serializer_class = ArchiveSerializer


    def get(self, request, format=None):
        perfomance = self.model_class.objects.filter(deleted_at=None)
        serializer = self.serializer_class(perfomance, many=True)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=ArchiveSerializer)
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ArchiveListAdmin(APIView):
    model_class = Archive
    serializer_class = ArchiveSerializer


    def get(self, request, format=None):
        archive_data = self.model_class.objects.order_by('id')
        serializer = self.serializer_class(archive_data, many=True)
        return Response(serializer.data)


class ArchiveDetail(APIView):
    model_class = Archive
    serializer_class = ArchiveSerializer


    def get(self, request, id, format=None):
        perfomance = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(perfomance)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=ArchiveSerializer)
    def put(self, request, id, format=None):
        perfomance = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(perfomance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, id, format=None):
        perfomance = get_object_or_404(self.model_class, id=id)
        perfomance.deleted_at = datetime.now()
        perfomance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AchievementsList(APIView):
    model_class = Achievements
    serializer_class = AchievementsSerializer


    def get(self, request, format=None):
        achievements = self.model_class.objects.filter(deleted_at=None)
        serializer = self.serializer_class(achievements, many=True)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=AchievementsSerializer)
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AchievementListAdmin(APIView):
    model_class = Achievements
    serializer_class = AchievementsSerializer


    def get(self, request, format=None):
        achievements = self.model_class.objects.order_by('id')
        serializer = self.serializer_class(achievements, many=True)
        return Response(serializer.data)


class AchievementDetail(APIView):
    model_class = Achievements
    serializer_class = AchievementsSerializer


    def get(self, request, id, format=None):
        achievement = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(achievement)
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=AchievementsSerializer)
    def put(self, request, id, format=None):
        achievement = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(achievement, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, id, format=None):
        achievement = get_object_or_404(self.model_class, id=id)
        achievement.deleted_at = datetime.now()
        achievement.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AfishaList(APIView):
    model_class = Perfomances
    serializer_class = PerfomanceSerializer


    def get(self, request, format=None):
        performances = Perfomances.objects.filter(afisha=True).values(
            'id', 'title', 'description', 'premiere_date',
            'age_limit', 'image_url', 'the_cast', 'genre'
        )

        archives = Archive.objects.filter(afisha=True).values(
            'id', 'title', 'description', 'premiere_date', 'age_limit', 'image_url'
        )

        performances_list = [
            {
                'type': 'performance',
                'id': p['id'],
                'title': p['title'],
                'description': p['description'],
                'premiere_date': p['premiere_date'],
                'age_limit': p['age_limit'],
                'image_url': p['image_url'],
                'the_cast': p['the_cast'],
                'genre': p['genre']
            } for p in performances
        ]

        archives_list = [
            {
                'type': 'archive',
                'id': a['id'],
                'title': a['title'],
                'description': a['description'],
                'premiere_date': a['premiere_date'],
                'age_limit': a['age_limit'],
                'image_url': a['image_url']
            } for a in archives
        ]

        all_perf_afisha = performances_list + archives_list

        return Response(all_perf_afisha)




class ImageUploadView(APIView):
    """
    API endpoint для загрузки изображений в MinIO
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(operation_description="Загрузка изображения в MinIO", request_body=None)
    def post(self, request):
        try:
            # Проверяем наличие файла
            if 'image' not in request.FILES:
                return Response(
                    {'error': 'Файл изображения не найден'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            image_file = request.FILES['image']
            folder = request.data.get('folder', 'images')
            
            # Проверяем тип файла
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
            if image_file.content_type not in allowed_types:
                return Response(
                    {'error': 'Неподдерживаемый тип файла. Разрешены только изображения.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Проверяем размер файла (максимум 10MB)
            if image_file.size > 10 * 1024 * 1024:
                return Response(
                    {'error': 'Размер файла превышает 10MB'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Загружаем изображение в MinIO
            image_url = upload_image_to_minio(image_file, folder)
            
            return Response({
                'success': True,
                'image_url': image_url,
                'message': 'Изображение успешно загружено'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Ошибка при загрузке изображения: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ImageDeleteView(APIView):
    """
    API endpoint для удаления изображений из MinIO
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Удаление изображения из MinIO",
        request_body=None,
    )
    def delete(self, request):
        try:
            image_url = request.query_params.get('image_url')
            
            if not image_url:
                return Response(
                    {'error': 'URL изображения не указан'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Удаляем изображение из MinIO
            delete_image_from_minio(image_url)
            
            return Response({
                'success': True,
                'message': 'Изображение успешно удалено'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Ошибка при удалении изображения: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
