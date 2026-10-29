import time
from django.core.management.base import BaseCommand, CommandError
from django.db import close_old_connections
from my_app1.vk_jobs import worker_tick


class Command(BaseCommand):
    help = 'Обрабатывает очередь и расписание импорта отзывов VK (PostgreSQL).'

    def add_arguments(self, parser):
        parser.add_argument('--once', action='store_true', help='Один проход очереди и выход.')

    def handle(self, *args, **options):
        while True:
            close_old_connections()
            # При неожиданном сбое процесс выходит с ненулевым кодом;
            # Compose перезапускает, running job восстанавливается после stale timeout.
            job = worker_tick()
            if job:
                self.stdout.write(f'VK job {job.pk}: {job.status}')
            if options['once']:
                if job and job.status in ('failed', 'partial'):
                    raise CommandError(job.error)
                return
            time.sleep(5)
