from django.core.management.base import BaseCommand
from my_app1.vk_parser import parse_reviews, VkParserError


class Command(BaseCommand):
    help = ('Парсит отзывы из группы ВК (комментарии к постам-приглашениям). '
            'Первый запуск — полный проход; далее — первые 20 постов. '
            'Запускать по расписанию раз в две недели (cron / планировщик).')

    def add_arguments(self, parser):
        parser.add_argument(
            '--full', action='store_true',
            help='Принудительно полный проход по всей стене.'
        )

    def handle(self, *args, **options):
        try:
            result = parse_reviews(full=options['full'])
        except VkParserError as exc:
            self.stderr.write(self.style.ERROR(f'Парсер не выполнен: {exc}'))
            return
        self.stdout.write(self.style.SUCCESS(
            f"Готово. Постов-приглашений: {result['posts']}, "
            f"новых отзывов: {result['added']} (full={result['full']})."
        ))
