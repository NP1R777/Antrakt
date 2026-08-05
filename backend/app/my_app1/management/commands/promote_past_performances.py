"""Перевод прошедших спектаклей из раздела "Афиша" в раздел "Спектакли".

Спектакль считается прошедшим, когда у него есть хотя бы один показ и все его
показы (`PerformanceShow`) уже состоялись (последний показ в прошлом). При
переводе роли из состава однократно добавляются на страницы актёров.

Команда идемпотентна и безопасна при повторных и параллельных запусках —
её можно запускать по расписанию (cron / systemd-timer) сколь угодно часто.
"""

from django.core.management.base import BaseCommand
from django.db.models import Max
from django.utils import timezone

from my_app1.models import (
    Perfomances, promote_performance, promote_past_performances,
    promote_past_archives,
)


class Command(BaseCommand):
    help = ('Переводит спектакли с прошедшими показами из "Афиши" в "Спектакли" '
            'и мероприятия из "Афиши" в "Проекты".')

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Показать, какие спектакли будут переведены, ничего не меняя.',
        )

    def handle(self, *args, **options):
        now = timezone.now()
        dry_run = options['dry_run']

        candidates = (
            Perfomances.objects
            .filter(afisha=True, deleted_at__isnull=True)
            .annotate(last_show=Max('shows__show_datetime'))
            .filter(last_show__isnull=False, last_show__lte=now)
            .order_by('id')
        )

        promoted = 0
        for performance in candidates:
            if dry_run:
                self.stdout.write(
                    f'[dry-run] Будет переведён: #{performance.id} "{performance.title}" '
                    f'(последний показ: {performance.last_show})'
                )
                promoted += 1
                continue

            promote_performance(performance)
            promoted += 1
            self.stdout.write(self.style.SUCCESS(
                f'Переведён в "Спектакли": #{performance.id} "{performance.title}"'
            ))

        if promoted == 0:
            self.stdout.write('Нет спектаклей для перевода.')
        else:
            verb = 'Будет переведено' if dry_run else 'Переведено'
            self.stdout.write(self.style.SUCCESS(f'{verb} спектаклей: {promoted}'))

        # Мероприятия (проекты): premiere_date уже в прошлом → из афиши в проекты.
        if dry_run:
            from my_app1.models import Archive
            today = timezone.localdate()
            archive_qs = Archive.objects.filter(
                afisha=True,
                deleted_at__isnull=True,
                afisha_hold=False,
                premiere_date__isnull=False,
                premiere_date__lt=today,
            )
            for item in archive_qs:
                self.stdout.write(
                    f'[dry-run] Мероприятие в «Проекты»: #{item.id} "{item.title}" '
                    f'(premiere_date: {item.premiere_date})'
                )
            self.stdout.write(
                self.style.SUCCESS(f'Будет переведено мероприятий: {archive_qs.count()}')
            )
        else:
            archives = promote_past_archives()
            if not archives:
                self.stdout.write('Нет мероприятий для перевода в «Проекты».')
            else:
                for item in archives:
                    self.stdout.write(self.style.SUCCESS(
                        f'Переведено в «Проекты»: #{item.id} "{item.title}"'
                    ))
                self.stdout.write(self.style.SUCCESS(
                    f'Переведено мероприятий: {len(archives)}'
                ))
