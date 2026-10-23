from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from my_app1.models import Actors, DirectorsTheatre, Perfomances, PerformanceCast, PerformanceShow, User, Review


class Command(BaseCommand):
    help = 'Добавить вымышленные данные разработки без импорта реальных пользователей и токенов.'

    @transaction.atomic
    def handle(self, *args, **options):
        director, _ = DirectorsTheatre.objects.get_or_create(
            name='Демонстрационный режиссёр', defaults={'description': 'Вымышленный персонаж.'},
        )
        actor, _ = Actors.objects.get_or_create(name='Демонстрационный актёр', defaults={
            'favorite_quote': 'Пример цитаты', 'author_quote': 'Вымышленный автор', 'image_url': '',
        })
        performance, _ = Perfomances.objects.get_or_create(title='Демонстрационный спектакль', defaults={
            'author': 'Вымышленный автор', 'genre': 'Драма', 'age_limit': '12+',
            'description': 'Спектакль для проверки интерфейса.', 'afisha': False, 'director': director,
        })
        PerformanceCast.objects.get_or_create(performance=performance, actor=actor, defaults={'role': 'Главная роль'})
        upcoming, _ = Perfomances.objects.get_or_create(title='Демонстрационная премьера', defaults={
            'author': 'Вымышленный автор', 'genre': 'Комедия', 'age_limit': '6+',
            'description': 'Будущий показ для проверки афиши.', 'afisha': True, 'director': director,
        })
        if not upcoming.shows.exists():
            PerformanceShow.objects.create(performance=upcoming, show_datetime=timezone.now() + timedelta(days=30))
        user, created = User.objects.get_or_create(email='demo-viewer@example.invalid', defaults={'profile_photo': ''})
        if created:
            user.set_unusable_password()
            user.save(update_fields=['password'])
        Review.objects.get_or_create(author=user, performance=performance, defaults={'text': 'Вымышленный отзыв для проверки страницы.'})
        self.stdout.write(self.style.SUCCESS('Демонстрационные данные готовы. Пароли и права администратора не создавались.'))
