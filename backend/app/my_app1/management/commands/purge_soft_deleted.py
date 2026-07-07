"""Окончательное удаление записей, помеченных на мягкое удаление.

Записи, у которых `deleted_at` старше N дней (по умолчанию 60), удаляются из БД
полностью. Команда идемпотентна и предназначена для запуска по расписанию
(cron / systemd-timer), рядом с `promote_past_performances`.
"""

from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from my_app1.models import (
    Perfomances, Actors, DirectorsTheatre, News, Archive, Achievements,
    Review, User,
)

RETENTION_DAYS = 60

# Модели с мягким удалением (полем deleted_at).
SOFT_DELETE_MODELS = [
    Review, Perfomances, Actors, DirectorsTheatre, News, Archive,
    Achievements, User,
]


class Command(BaseCommand):
    help = ('Полностью удаляет из БД записи, помеченные на удаление '
            '(deleted_at) более N дней назад (по умолчанию 60).')

    def add_arguments(self, parser):
        parser.add_argument('--days', type=int, default=RETENTION_DAYS,
                            help='Через сколько дней после мягкого удаления чистить.')
        parser.add_argument('--dry-run', action='store_true',
                            help='Показать, что будет удалено, ничего не удаляя.')

    def handle(self, *args, **options):
        cutoff = timezone.now() - timedelta(days=options['days'])
        dry_run = options['dry_run']
        total = 0
        for model in SOFT_DELETE_MODELS:
            qs = model.objects.filter(deleted_at__isnull=False, deleted_at__lt=cutoff)
            count = qs.count()
            if not count:
                continue
            total += count
            if dry_run:
                self.stdout.write(f'[dry-run] {model.__name__}: будет удалено {count}')
            else:
                qs.delete()
                self.stdout.write(self.style.SUCCESS(
                    f'{model.__name__}: удалено окончательно — {count}'))
        if total == 0:
            self.stdout.write('Нет записей для окончательного удаления.')
        else:
            verb = 'Будет удалено' if dry_run else 'Итого удалено'
            self.stdout.write(self.style.SUCCESS(f'{verb}: {total}'))
