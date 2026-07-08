import uuid
import random
import boto3
from .models import *
from .serializers import *
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.utils import timezone
from django.db.models import Max
from urllib.parse import urlparse
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404
from botocore.client import Config as BotoConfig
from rest_framework import status, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def is_hard_delete(request):
    """True, если запрошено жёсткое (полное) удаление через ?hard=1.

    По умолчанию удаление мягкое (проставляется deleted_at); полностью запись
    удаляется фоновой командой спустя 60 дней либо сразу при ?hard=1.
    """
    return str(request.query_params.get('hard', '')).lower() in ('1', 'true', 'yes')


class IsSuperUser(permissions.BasePermission):
    """Доступ только суперпользователям (админам сайта).

    В проекте роль «админ» определяется полем is_superuser (по нему пускает и
    фронтенд/админ-панель), поэтому админские эндпоинты проверяют именно его,
    а не is_staff (как в стандартном DRF IsAdminUser).
    """
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_superuser)


class UserList(APIView):
    model_class = User
    serializer_class = UserSerializer
    permission_classes = [IsSuperUser]


    def get(self, request, format=None):
        users = self.model_class.objects.filter(deleted_at=None).order_by('id')
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data)


class UserListAdmin(APIView):
    model_class = User
    serializer_class = UserSerializer
    permission_classes = [IsSuperUser]


    def get(self, request, format=None):
        users = self.model_class.objects.order_by('id')
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data)


class UserDetail(APIView):
    model_class = User
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def _ensure_can_access(self, request, target_id):
        # Доступ к чужому профилю — только у администратора.
        if not (request.user.is_superuser or request.user.id == target_id):
            return False
        return True

    def get(self, request, id, format=None):
        if not self._ensure_can_access(request, id):
            return Response({"error": "Недостаточно прав"}, status=status.HTTP_403_FORBIDDEN)
        user = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(user)
        return Response(serializer.data)
    
    
    @swagger_auto_schema(request_body=UserSerializer)
    def put(self, request, id, format=None):
        if not self._ensure_can_access(request, id):
            return Response({"error": "Недостаточно прав"}, status=status.HTTP_403_FORBIDDEN)
        user = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, id, format=None):
        if not self._ensure_can_access(request, id):
            return Response({"error": "Недостаточно прав"}, status=status.HTTP_403_FORBIDDEN)
        user = get_object_or_404(self.model_class, id=id)
        if is_hard_delete(request):
            user.delete()
        else:
            user.deleted_at = timezone.now()
            user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChangePasswordView(APIView):
    """Смена пароля с проверкой текущего и корректным хешированием."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data['current_password']):
            return Response({"error": "Неверный текущий пароль"},
                            status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save(update_fields=['password'])
        return Response({"success": True, "message": "Пароль изменён"})


def _generate_code():
    return f"{random.randint(0, 999999):06d}"


def _send_verification_email(email, code):
    send_mail(
        subject='Код подтверждения регистрации — театр «Антракт»',
        message=(f'Ваш код подтверждения регистрации: {code}\n'
                 f'Код действителен {EmailVerification.CODE_TTL_MINUTES} минут.\n\n'
                 f'Если вы не регистрировались на сайте театра «Антракт», '
                 f'просто проигнорируйте это письмо.'),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )


class RegisterView(generics.CreateAPIView):
    """Шаг 1 регистрации: проверка данных и отправка кода подтверждения на email.

    Пользователь на этом шаге НЕ создаётся — сохраняется только запись
    EmailVerification. Реальный аккаунт появится после подтверждения кода.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        email = data['email']

        existing = EmailVerification.objects.filter(email=email).first()
        if existing and existing.last_sent_at:
            elapsed = (timezone.now() - existing.last_sent_at).total_seconds()
            if elapsed < EmailVerification.RESEND_COOLDOWN_SECONDS:
                wait = int(EmailVerification.RESEND_COOLDOWN_SECONDS - elapsed)
                return Response(
                    {"error": f"Код уже отправлен. Повторите через {wait} сек."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS)

        code = _generate_code()
        EmailVerification.objects.update_or_create(
            email=email,
            defaults={
                'code': code,
                'password': make_password(data['password']),
                'phone_number': data.get('phone_number') or None,
                'attempts': 0,
                'last_sent_at': timezone.now(),
                'expires_at': timezone.now() + timedelta(
                    minutes=EmailVerification.CODE_TTL_MINUTES),
            }
        )
        try:
            _send_verification_email(email, code)
        except Exception as exc:
            return Response({"error": f"Не удалось отправить код: {exc}"},
                            status=status.HTTP_502_BAD_GATEWAY)
        return Response(
            {"message": "Код подтверждения отправлен на почту", "email": email},
            status=status.HTTP_200_OK)


class RegisterVerifyView(APIView):
    """Шаг 2 регистрации: проверка кода и создание пользователя."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        email = request.data.get('email')
        code = (request.data.get('code') or '').strip()
        pending = EmailVerification.objects.filter(email=email).first()
        if not pending:
            return Response(
                {"error": "Заявка на регистрацию не найдена. Зарегистрируйтесь заново."},
                status=status.HTTP_400_BAD_REQUEST)
        if pending.is_expired():
            pending.delete()
            return Response({"error": "Срок действия кода истёк. Запросите новый код."},
                            status=status.HTTP_400_BAD_REQUEST)
        if pending.attempts >= EmailVerification.MAX_ATTEMPTS:
            pending.delete()
            return Response({"error": "Слишком много попыток. Зарегистрируйтесь заново."},
                            status=status.HTTP_400_BAD_REQUEST)
        if code != pending.code:
            pending.attempts += 1
            pending.save(update_fields=['attempts'])
            remaining = EmailVerification.MAX_ATTEMPTS - pending.attempts
            return Response(
                {"error": f"Неверный код. Осталось попыток: {remaining}"},
                status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email__iexact=email).exists():
            pending.delete()
            return Response({"error": "Пользователь с таким email уже существует"},
                            status=status.HTTP_400_BAD_REQUEST)

        phone = pending.phone_number
        if phone and User.objects.filter(phone_number=phone).exists():
            phone = None  # телефон заняли за время подтверждения — не блокируем регистрацию

        user = User(email=email, phone_number=phone, profile_photo='')
        user.password = pending.password  # уже захешированный на шаге 1
        user.save()
        pending.delete()
        return Response(
            {"message": "Регистрация подтверждена", "email": email},
            status=status.HTTP_201_CREATED)


class RegisterResendView(APIView):
    """Повторная отправка кода подтверждения (с кулдауном)."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        email = request.data.get('email')
        pending = EmailVerification.objects.filter(email=email).first()
        if not pending:
            return Response(
                {"error": "Заявка на регистрацию не найдена. Зарегистрируйтесь заново."},
                status=status.HTTP_400_BAD_REQUEST)
        if pending.last_sent_at:
            elapsed = (timezone.now() - pending.last_sent_at).total_seconds()
            if elapsed < EmailVerification.RESEND_COOLDOWN_SECONDS:
                wait = int(EmailVerification.RESEND_COOLDOWN_SECONDS - elapsed)
                return Response(
                    {"error": f"Повторная отправка возможна через {wait} сек."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS)

        pending.code = _generate_code()
        pending.attempts = 0
        pending.last_sent_at = timezone.now()
        pending.expires_at = timezone.now() + timedelta(
            minutes=EmailVerification.CODE_TTL_MINUTES)
        pending.save(update_fields=['code', 'attempts', 'last_sent_at', 'expires_at'])
        try:
            _send_verification_email(email, pending.code)
        except Exception as exc:
            return Response({"error": f"Не удалось отправить код: {exc}"},
                            status=status.HTTP_502_BAD_GATEWAY)
        return Response({"message": "Новый код отправлен"}, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Сохраняем токены в базе для пользователя
            identifier_email = request.data.get('email')
            identifier_phone = request.data.get('phone_number')
            user = None
            try:
                if identifier_email:
                    user = User.objects.filter(email=identifier_email).first()
                if not user and identifier_phone:
                    user = User.objects.filter(phone_number=identifier_phone).first()
                if not user:
                    # Последняя попытка: получить пользователя из access токена
                    access = response.data.get('access')
                    if access:
                        token = AccessToken(access)
                        user_id = token.payload.get('user_id')
                        user = User.objects.filter(id=user_id).first()
                if user:
                    user.access_token = response.data['access']
                    user.refresh_token = response.data['refresh']
                    user.save()
            except Exception:
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
        serializer = self.serializer_class(perfomances, many=True,
                                           context={'request': request})
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=PerfomanceSerializer)
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PerfomancesListAdmin(APIView):
    model_class = Perfomances
    serializer_class = PerfomanceSerializer


    def get(self, request, format=None):
        perfomances = self.model_class.objects.order_by('id')
        serializer = self.serializer_class(perfomances, many=True,
                                           context={'request': request})
        return Response(serializer.data)


class PerfomanceDetail(APIView):
    model_class = Perfomances
    serializer_class = PerfomanceSerializer


    def get(self, request, id, format=None):
        perfomance = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(perfomance, context={'request': request})
        return Response(serializer.data)
    

    @swagger_auto_schema(request_body=PerfomanceSerializer)
    def put(self, request, id, format=None):
        perfomance = get_object_or_404(self.model_class, id=id)
        serializer = self.serializer_class(perfomance, data=request.data, partial=True,
                                           context={'request': request})
        if serializer.is_valid():
            instance = serializer.save()
            # Ручной перевод в "Спектакли" из админки тоже раздаёт роли актёрам.
            # promote_performance идемпотентна: вызываем при любом сохранении
            # в статусе "Спектакли", чтобы догналось добавление режиссёру,
            # если его назначили уже после перевода спектакля.
            if not instance.afisha:
                instance = promote_performance(instance)
            serializer = self.serializer_class(instance, context={'request': request})
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, id, format=None):
        perfomance = get_object_or_404(self.model_class, id=id)
        if is_hard_delete(request):
            perfomance.delete()
        else:
            perfomance.deleted_at = timezone.now()
            perfomance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ActorsList(APIView):
    model_class = Actors
    serializer_class = ActorsSerializer


    def get(self, request, format=None):
        actors = self.model_class.objects.filter(deleted_at=None).order_by('id')
        # ?active=1 — только действующие актёры (без выбывших): используется,
        # например, в выпадающем списке состава при выборе ролей в админке.
        if str(request.query_params.get('active', '')).lower() in ('1', 'true', 'yes'):
            actors = actors.filter(left_at__isnull=True)
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
        if is_hard_delete(request):
            actor.delete()
        else:
            actor.deleted_at = timezone.now()
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
        if is_hard_delete(request):
            director.delete()
        else:
            director.deleted_at = timezone.now()
            director.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NewsList(APIView):
    model_class = News
    serializer_class = NewsSerializer


    def get(self, request, format=None):
        news = self.model_class.objects.filter(deleted_at=None,
                                               is_published=True).order_by('date_publish').reverse()
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
        if is_hard_delete(request):
            news.delete()
        else:
            news.deleted_at = timezone.now()
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
        if is_hard_delete(request):
            perfomance.delete()
        else:
            perfomance.deleted_at = timezone.now()
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
        if is_hard_delete(request):
            achievement.delete()
        else:
            achievement.deleted_at = timezone.now()
            achievement.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AfishaList(APIView):
    model_class = Perfomances
    serializer_class = PerfomanceSerializer


    def get(self, request, format=None):
        # В "Афише" состав и роли НЕ отдаём — они появляются только после
        # перехода спектакля в раздел "Спектакли". Зато отдаём расписание
        # показов (даты и время), чтобы зрители знали, когда прийти.
        performances = Perfomances.objects.filter(
            afisha=True, deleted_at=None
        ).select_related('director').prefetch_related('shows')

        archives = Archive.objects.filter(afisha=True).values(
            'id', 'title', 'description', 'premiere_date', 'age_limit', 'image_url'
        )

        performances_list = [
            {
                'type': 'performance',
                'id': p.id,
                'title': p.title,
                'description': p.description,
                'premiere_date': p.premiere_date,
                'age_limit': p.age_limit,
                'image_url': p.image_url,
                'genre': p.genre,
                'ticket_url': p.ticket_url,
                'director': p.director_id,
                'director_name': (p.director.name if p.director_id else None),
                'shows': [
                    {
                        'id': s.id,
                        'show_datetime': s.show_datetime,
                        'ticket_url': s.ticket_url,
                    } for s in p.shows.all()
                ],
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


def _minio_client():
    """S3-клиент для MinIO. Единый источник настроек — Django settings
    (endpoint/креды/бакет берутся из переменных окружения MINIO_*), чтобы не
    было рассинхрона между кодом и docker-compose."""
    return boto3.client(
        's3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
        config=BotoConfig(signature_version='s3v4', proxies={})
    )


class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        if 'image' not in request.FILES:
            return Response({"success": False, "message": "Не найден файл 'image'"}, status=400)
        image = request.FILES['image']
        folder = request.data.get('folder', 'images')

        s3_client = _minio_client()
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        extension = image.name.split('.')[-1].lower()
        object_key = f"{folder}/{uuid.uuid4().hex}.{extension}"

        s3_client.upload_fileobj(
            image,
            bucket,
            object_key,
            ExtraArgs={
                'ContentType': image.content_type or 'application/octet-stream',
                'ACL': 'public-read'
            }
        )

        # Публичный URL строим из настроенного endpoint MinIO.
        public_url = f"{settings.AWS_S3_ENDPOINT_URL.rstrip('/')}/{bucket}/{object_key}"
        return Response({"success": True, "image_url": public_url, "message": "Изображение загружено"})


class ImageDeleteView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request, *args, **kwargs):
        image_url = request.query_params.get('image_url')
        if not image_url:
            return Response({"success": False, "message": "Параметр image_url обязателен"}, status=400)
        parsed = urlparse(image_url)
        # Expected format: http(s)://<endpoint>/<bucket>/<key>
        path = parsed.path.lstrip('/')
        # If custom domain used as <endpoint>/<bucket>, first segment is bucket
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        if path.startswith(bucket + '/'):
            object_key = path[len(bucket) + 1:]
        else:
            # fallback: whole path is key
            object_key = path

        s3_client = _minio_client()

        try:
            s3_client.delete_object(Bucket=bucket, Key=object_key)
            return Response({"success": True, "message": "Изображение удалено"})
        except Exception:
            return Response({"success": False, "message": "Не удалось удалить изображение"}, status=400)


# ============================ Отзывы и реакции ============================

def _serialize_reviews(reviews, request):
    return ReviewSerializer(reviews, many=True, context={'request': request}).data


class PerformanceReviewList(APIView):
    """Отзывы о спектакле: список (публично) и создание (авторизованным)."""

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, id, format=None):
        performance = get_object_or_404(Perfomances, id=id)
        reviews = (performance.reviews
                   .filter(deleted_at__isnull=True)
                   .select_related('author')
                   .prefetch_related('reactions')
                   .order_by('-created_at'))
        return Response(_serialize_reviews(reviews, request))

    def post(self, request, id, format=None):
        performance = get_object_or_404(Perfomances, id=id)
        text = (request.data.get('text') or '').strip()
        if not text:
            return Response({"error": "Текст отзыва обязателен"},
                            status=status.HTTP_400_BAD_REQUEST)
        review = Review.objects.create(
            author=request.user, performance=performance, text=text
        )
        serializer = ReviewSerializer(review, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ActorReviewList(APIView):
    """Отзывы об актёре: список (публично) и создание (авторизованным)."""

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, id, format=None):
        actor = get_object_or_404(Actors, id=id)
        reviews = (actor.reviews
                   .filter(deleted_at__isnull=True)
                   .select_related('author')
                   .prefetch_related('reactions')
                   .order_by('-created_at'))
        return Response(_serialize_reviews(reviews, request))

    def post(self, request, id, format=None):
        actor = get_object_or_404(Actors, id=id)
        text = (request.data.get('text') or '').strip()
        if not text:
            return Response({"error": "Текст отзыва обязателен"},
                            status=status.HTTP_400_BAD_REQUEST)
        review = Review.objects.create(
            author=request.user, actor=actor, text=text
        )
        serializer = ReviewSerializer(review, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DirectorReviewList(APIView):
    """Отзывы о режиссёре: список (публично) и создание (авторизованным)."""

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, id, format=None):
        director = get_object_or_404(DirectorsTheatre, id=id)
        reviews = (director.reviews
                   .filter(deleted_at__isnull=True)
                   .select_related('author')
                   .prefetch_related('reactions')
                   .order_by('-created_at'))
        return Response(_serialize_reviews(reviews, request))

    def post(self, request, id, format=None):
        director = get_object_or_404(DirectorsTheatre, id=id)
        text = (request.data.get('text') or '').strip()
        if not text:
            return Response({"error": "Текст отзыва обязателен"},
                            status=status.HTTP_400_BAD_REQUEST)
        review = Review.objects.create(
            author=request.user, director=director, text=text
        )
        serializer = ReviewSerializer(review, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ArchiveReviewList(APIView):
    """Отзывы к архивному мероприятию (только для раздела «Архив», afisha=False)."""

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, id, format=None):
        archive = get_object_or_404(Archive, id=id)
        reviews = (archive.reviews
                   .filter(deleted_at__isnull=True)
                   .select_related('author')
                   .prefetch_related('reactions')
                   .order_by('-created_at'))
        return Response(_serialize_reviews(reviews, request))

    def post(self, request, id, format=None):
        archive = get_object_or_404(Archive, id=id)
        # Комментарии разрешены только для прошедших мероприятий (раздел «Архив»).
        if archive.afisha:
            return Response(
                {"error": "Комментарии доступны только для прошедших мероприятий"},
                status=status.HTTP_400_BAD_REQUEST)
        text = (request.data.get('text') or '').strip()
        if not text:
            return Response({"error": "Текст отзыва обязателен"},
                            status=status.HTTP_400_BAD_REQUEST)
        review = Review.objects.create(
            author=request.user, archive=archive, text=text
        )
        serializer = ReviewSerializer(review, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NewsReviewList(APIView):
    """Комментарии к новости: список (публично) и создание (авторизованным)."""

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, id, format=None):
        news = get_object_or_404(News, id=id)
        reviews = (news.reviews
                   .filter(deleted_at__isnull=True)
                   .select_related('author')
                   .prefetch_related('reactions')
                   .order_by('-created_at'))
        return Response(_serialize_reviews(reviews, request))

    def post(self, request, id, format=None):
        news = get_object_or_404(News, id=id)
        text = (request.data.get('text') or '').strip()
        if not text:
            return Response({"error": "Текст отзыва обязателен"},
                            status=status.HTTP_400_BAD_REQUEST)
        review = Review.objects.create(
            author=request.user, news=news, text=text
        )
        serializer = ReviewSerializer(review, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewDetail(APIView):
    """Удаление отзыва: автором или администратором.

    По умолчанию — мягкое удаление (deleted_at); при ?hard=1 — жёсткое
    (полное удаление из БД сразу, без ожидания 60 дней).
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, id, format=None):
        review = get_object_or_404(Review, id=id)
        if review.author_id != request.user.id and not request.user.is_superuser:
            return Response({"error": "Недостаточно прав"},
                            status=status.HTTP_403_FORBIDDEN)
        if is_hard_delete(request):
            review.delete()
        else:
            review.deleted_at = timezone.now()
            review.save(update_fields=['deleted_at'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewReactionView(APIView):
    """Переключение реакции пользователя на отзыв (не более 3 разных типов)."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id, format=None):
        review = get_object_or_404(Review, id=id)
        reaction = request.data.get('reaction')
        if reaction not in dict(ReviewReaction.REACTION_CHOICES):
            return Response({"error": "Недопустимая реакция"},
                            status=status.HTTP_400_BAD_REQUEST)

        existing = ReviewReaction.objects.filter(
            review=review, user=request.user, reaction=reaction
        ).first()
        if existing:
            existing.delete()
        else:
            count = ReviewReaction.objects.filter(
                review=review, user=request.user
            ).count()
            if count >= Review.MAX_REACTIONS_PER_USER:
                return Response(
                    {"error": f"Можно поставить не более "
                              f"{Review.MAX_REACTIONS_PER_USER} реакций на отзыв"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            ReviewReaction.objects.create(
                review=review, user=request.user, reaction=reaction
            )

        review.refresh_from_db()
        serializer = ReviewSerializer(review, context={'request': request})
        return Response(serializer.data)


class ReviewWarnView(APIView):
    """Отправка предупреждающего письма автору отзыва (только администратор)."""
    permission_classes = [IsSuperUser]

    def post(self, request, id, format=None):
        review = get_object_or_404(Review, id=id)
        message = (request.data.get('message') or '').strip()
        if not message:
            return Response({"error": "Текст письма обязателен"},
                            status=status.HTTP_400_BAD_REQUEST)
        if not review.author.email:
            return Response({"error": "У пользователя не указан email"},
                            status=status.HTTP_400_BAD_REQUEST)
        subject = (request.data.get('subject') or
                   'Предупреждение от театра «Антракт»')
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[review.author.email],
                fail_silently=False,
            )
        except Exception as exc:
            return Response({"error": f"Не удалось отправить письмо: {exc}"},
                            status=status.HTTP_502_BAD_GATEWAY)
        return Response({"success": True, "message": "Письмо отправлено"})


class MyReviewsList(APIView):
    """Отзывы текущего пользователя (для личного кабинета)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        reviews = (Review.objects
                   .filter(author=request.user, deleted_at__isnull=True)
                   .select_related('author', 'performance', 'actor',
                                   'director', 'archive', 'news')
                   .prefetch_related('reactions')
                   .order_by('-created_at'))
        return Response(_serialize_reviews(reviews, request))


class ReviewListAdmin(APIView):
    """Все отзывы (для модерации в админ-панели)."""
    permission_classes = [IsSuperUser]

    def get(self, request, format=None):
        reviews = (Review.objects
                   .filter(deleted_at__isnull=True)
                   .select_related('author', 'performance', 'actor',
                                   'director', 'archive', 'news')
                   .prefetch_related('reactions')
                   .order_by('-created_at'))
        return Response(_serialize_reviews(reviews, request))


# ---------------------------------------------------------------------------
# Редактируемые надписи сайта (мини-CMS)
# ---------------------------------------------------------------------------

class SiteContentList(APIView):
    """GET — все надписи (публично, для рендера сайта);
    PUT — массовое обновление значений (из админ-панели)."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        items = SiteContent.objects.all()
        return Response(SiteContentSerializer(items, many=True).data)

    def put(self, request, format=None):
        data = request.data
        items = data.get('items', []) if isinstance(data, dict) else data
        if not isinstance(items, list):
            return Response({"error": "Ожидается список {key, value}"},
                            status=status.HTTP_400_BAD_REQUEST)
        updated = []
        for it in items:
            if not isinstance(it, dict):
                continue
            key = it.get('key')
            if not key:
                continue
            obj = SiteContent.objects.filter(key=key).first()
            if obj:
                obj.value = it.get('value', '') or ''
                obj.save(update_fields=['value', 'updated_at'])
                updated.append(key)
        return Response({"success": True, "updated": updated})


# ---------------------------------------------------------------------------
# Дни рождения актёров и поздравления
# ---------------------------------------------------------------------------

class BirthdayTodayView(APIView):
    """Возвращает актёра, у которого сегодня день рождения (по TIME_ZONE проекта),
    вместе с поздравительным текстом. Секция появляется/исчезает автоматически,
    так как расчёт идёт по текущей дате при каждом запросе."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        today = timezone.localdate()
        bday = (ActorBirthday.objects
                .select_related('actor')
                .filter(birth_date__month=today.month,
                        birth_date__day=today.day,
                        actor__deleted_at__isnull=True)
                .first())
        if not bday:
            return Response({"active": False})
        greetings = list(BirthdayGreeting.objects
                         .filter(is_active=True).order_by('id'))
        greeting = ''
        if greetings:
            # Детерминированный выбор варианта — не «прыгает» в течение дня.
            greeting = greetings[today.toordinal() % len(greetings)].text
        actor = bday.actor
        greeting = greeting.replace('{name}', actor.name)
        return Response({
            "active": True,
            "actor_id": actor.id,
            "actor_name": actor.name,
            "actor_image": actor.image_url,
            "birth_date": bday.birth_date,
            "greeting": greeting,
        })


class ActorBirthdayList(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        items = ActorBirthday.objects.select_related('actor').all()
        return Response(ActorBirthdaySerializer(items, many=True).data)

    def post(self, request, format=None):
        serializer = ActorBirthdaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActorBirthdayDetail(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, id):
        return get_object_or_404(ActorBirthday, id=id)

    def get(self, request, id, format=None):
        obj = self.get_object(id)
        return Response(ActorBirthdaySerializer(obj).data)

    def put(self, request, id, format=None):
        obj = self.get_object(id)
        serializer = ActorBirthdaySerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, format=None):
        obj = self.get_object(id)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BirthdayGreetingList(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        items = BirthdayGreeting.objects.all()
        return Response(BirthdayGreetingSerializer(items, many=True).data)

    def post(self, request, format=None):
        serializer = BirthdayGreetingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BirthdayGreetingDetail(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, id):
        return get_object_or_404(BirthdayGreeting, id=id)

    def get(self, request, id, format=None):
        obj = self.get_object(id)
        return Response(BirthdayGreetingSerializer(obj).data)

    def put(self, request, id, format=None):
        obj = self.get_object(id)
        serializer = BirthdayGreetingSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, format=None):
        obj = self.get_object(id)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
