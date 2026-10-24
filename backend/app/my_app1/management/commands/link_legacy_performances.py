import json
import os
from collections import Counter
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from my_app1.performance_relations import relationship_plan, apply_relationship_plan


class Command(BaseCommand):
    help = 'Безопасный анализ старых ролей; перенос только по явному --apply и digest отчёта.'

    def add_arguments(self, parser):
        parser.add_argument('--apply', action='store_true')
        parser.add_argument('--expected-digest')
        parser.add_argument('--report', help='Новый JSON-файл отчёта вне репозитория/в ignored каталоге.')

    def handle(self, *args, **options):
        if options['apply'] and not options['expected_digest']:
            raise CommandError('Для переноса нужен --expected-digest из проверенного отчёта.')
        target = Path(options['report']) if options['report'] else None
        if target and target.exists():
            raise CommandError('Файл отчёта уже существует; выберите новое имя.')
        with transaction.atomic():
            plan = apply_relationship_plan(options['expected_digest']) if options['apply'] else relationship_plan()
            if target:
                # Create private from the outset; report failures roll back the import.
                fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
                with os.fdopen(fd, 'w', encoding='utf-8') as stream:
                    json.dump(plan, stream, ensure_ascii=False, indent=2)
        self.stdout.write(json.dumps({'mode': 'apply' if options['apply'] else 'analysis', 'digest': plan['digest'],
                                     'actors': plan['actor_count'], 'directors': plan['director_count'],
                                     'statuses': dict(Counter(e['status'] for e in plan['entries']))}, ensure_ascii=False))
