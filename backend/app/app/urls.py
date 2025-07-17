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
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view


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
    path('users/', views.UserList.as_view(), name='user-list'),
    path('user<int:id>/', views.UserDetail.as_view(), name='user'),
    path('users-admin/', views.UserListAdmin.as_view(), name='user-list-admin'),
    path('register/', views.RegisterView.as_view(), name='register'),
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
    path('upload-image/', views.ImageUploadView.as_view(), name='upload-image'),
    path('delete-image/', views.ImageDeleteView.as_view(), name='delete-image'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name="schema-swagger-ui"),
]
