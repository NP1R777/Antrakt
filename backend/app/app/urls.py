"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from my_app1 import views
from drf_yasg import openapi
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from django.views.generic import TemplateView


def health_check(request):
    return JsonResponse({"status": "ok"}, status=200)


schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="zaharovila780@gmail.com"),
        license=openapi.License(name="BSD License")
    ),
    public=True,
    permission_classes=(permissions.AllowAny,)
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('health/', health_check, name='health-check'),
    path('users/', views.UserList.as_view(), name='user-list'),
    path('user<int:id>/', views.UserDetail.as_view(), name='user'),
    path('users-admin/', views.UserListAdmin.as_view(), name='user-list-admin'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('register/verify/', views.RegisterVerifyView.as_view(), name='register-verify'),
    path('register/resend/', views.RegisterResendView.as_view(), name='register-resend'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/verify/', views.VerifyTokenView.as_view(), name='token_verify'),
    path('perfomances/', views.PefomancesList.as_view(), name='perfomances-list'),
    path('perfomance<int:id>/', views.PerfomanceDetail.as_view(), name='perfomance'),
    path('perfomances-admin/', views.PerfomancesListAdmin.as_view(), name='perfomances-list-admin'),
    path('actors/', views.ActorsList.as_view(), name='actors-list'),
    path('actor<int:id>/', views.ActorDetail.as_view(), name='actor'),
    path('actors-admin/', views.ActorsListAdmin.as_view(), name='actors-list-admin'),
    path('directors/', views.DirectorsList.as_view(), name='directors-list'),
    path('director<int:id>/', views.DirectorDetail.as_view(), name='director'),
    path('directors-admin/', views.DirectorsListAdmin.as_view(), name='directors-list-admin'),
    path('news/', views.NewsList.as_view(), name='news-list'),
    path('news<int:id>/', views.NewsDetail.as_view(), name='news'),
    path('news-admin/', views.NewsListAdmin.as_view(), name='news-list-admin'),
    path('archive/', views.ArchiveList.as_view(), name='archive-list'),
    path('archive<int:id>/', views.ArchiveDetail.as_view(), name='archive'),
    path('archive-admin/', views.ArchiveListAdmin.as_view(), name='archive-list-admin'),
    path('achievements/', views.AchievementsList.as_view(), name='achievements-list'),
    path('achievement<int:id>/', views.AchievementDetail.as_view(), name="achievement"),
    path('achievements-admin/', views.AchievementListAdmin.as_view(), name='achievement-list-admin'),
    path('afisha/', views.AfishaList.as_view(), name='afisha-list'),
    path('perfomance<int:id>/reviews/', views.PerformanceReviewList.as_view(), name='performance-reviews'),
    path('actor<int:id>/reviews/', views.ActorReviewList.as_view(), name='actor-reviews'),
    path('director<int:id>/reviews/', views.DirectorReviewList.as_view(), name='director-reviews'),
    path('archive<int:id>/reviews/', views.ArchiveReviewList.as_view(), name='archive-reviews'),
    path('news<int:id>/reviews/', views.NewsReviewList.as_view(), name='news-reviews'),
    path('review<int:id>/', views.ReviewDetail.as_view(), name='review-detail'),
    path('review<int:id>/react/', views.ReviewReactionView.as_view(), name='review-react'),
    path('review<int:id>/warn/', views.ReviewWarnView.as_view(), name='review-warn'),
    path('my/reviews/', views.MyReviewsList.as_view(), name='my-reviews'),
    path('reviews-admin/', views.ReviewListAdmin.as_view(), name='reviews-admin'),
    path('upload-image/', views.ImageUploadView.as_view(), name='upload-image'),
    path('delete-image/', views.ImageDeleteView.as_view(), name='delete-image'),
    path('site-content/', views.SiteContentList.as_view(), name='site-content'),
    path('birthday-today/', views.BirthdayTodayView.as_view(), name='birthday-today'),
    path('actor-birthdays/', views.ActorBirthdayList.as_view(), name='actor-birthday-list'),
    path('actor-birthday<int:id>/', views.ActorBirthdayDetail.as_view(), name='actor-birthday'),
    path('birthday-greetings/', views.BirthdayGreetingList.as_view(), name='birthday-greeting-list'),
    path('birthday-greeting<int:id>/', views.BirthdayGreetingDetail.as_view(), name='birthday-greeting'),
    path('site-reviews/', views.SiteReviewList.as_view(), name='site-reviews'),
    path('site-reviews-admin/', views.SiteReviewListAdmin.as_view(), name='site-reviews-admin'),
    path('site-review<int:id>/', views.SiteReviewDetail.as_view(), name='site-review'),
    path('vk-reviews/parse/', views.VkReviewsParseView.as_view(), name='vk-reviews-parse'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name="schema-swagger-ui"),
]
