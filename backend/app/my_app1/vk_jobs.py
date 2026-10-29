"""Очередь VK в PostgreSQL. Session advisory lock не держит транзакцию на время сети."""
import hashlib
import logging
from contextlib import contextmanager
from datetime import timedelta

from django.conf import settings
from django.db import connection, transaction
from django.db.models import Q
from django.utils import timezone

from .models import VkImportJob, VkParserState
from .vk_parser import VkParserError, configured_backend, import_reviews, _select_backend

logger = logging.getLogger(__name__)
ACTIVE = ('pending', 'running')


def _lock_id(domain):
    return int.from_bytes(hashlib.sha256(('antrakt-vk:' + domain).encode()).digest()[:8], 'big', signed=True)


@contextmanager
def group_lock(domain):
    if connection.vendor != 'postgresql':
        raise VkParserError('Фоновый импорт VK требует PostgreSQL.')
    lock = _lock_id(domain)
    with connection.cursor() as cursor:
        cursor.execute('SELECT pg_try_advisory_lock(%s)', [lock])
        acquired = cursor.fetchone()[0]
    try:
        yield acquired
    finally:
        if acquired:
            with connection.cursor() as cursor:
                cursor.execute('SELECT pg_advisory_unlock(%s)', [lock])


def enqueue(full=False, *, trigger='manual'):
    mode, domain = configured_backend()
    with transaction.atomic():
        # Не используем lock импорта для очереди: active job должен возвращаться
        # немедленно, даже когда другой процесс обрабатывает сеть.
        queue_lock = _lock_id('queue:' + domain)
        with connection.cursor() as cursor:
            cursor.execute('SELECT pg_advisory_xact_lock(%s)', [queue_lock])
        active = VkImportJob.objects.filter(group_domain=domain, status__in=ACTIVE).first()
        if active:
            return active, False
        return VkImportJob.objects.create(group_domain=domain, backend=mode, full=full, trigger=trigger), True


def job_data(job):
    return {key: getattr(job, key) for key in (
        'id', 'group_domain', 'backend', 'full', 'trigger', 'status', 'stage', 'stats',
        'error', 'attempts', 'created_at', 'started_at', 'heartbeat_at', 'finished_at', 'available_at')}


def status_data():
    domain = getattr(settings, 'VK_GROUP_DOMAIN', 'tc_antrakt').strip()
    try:
        mode, domain = configured_backend()
        configured, error = True, ''
    except VkParserError as exc:
        mode, configured, error = '', False, str(exc)
    job = VkImportJob.objects.filter(group_domain=domain).first()
    success = VkImportJob.objects.filter(group_domain=domain, status='success').first()
    # Не создаём state при чтении статуса.
    state = VkParserState.objects.order_by('pk').first()
    last_success = success.finished_at if success else (state.last_run_at if state and state.group_domain in ('', domain) else None)
    return {'configured': configured, 'backend': mode, 'error': error, 'job': job_data(job) if job else None,
            'last_success_at': last_success,
            'interval_seconds': max(0, settings.VK_IMPORT_INTERVAL_SECONDS)}


def schedule_if_due():
    if settings.VK_IMPORT_INTERVAL_SECONDS <= 0:
        return None
    try:
        _, domain = configured_backend()
    except VkParserError:
        return None
    # Синхронизируем проверку due и enqueue между несколькими worker.
    with transaction.atomic():
        with connection.cursor() as cursor:
            cursor.execute('SELECT pg_advisory_xact_lock(%s)', [_lock_id('queue:' + domain)])
        latest = VkImportJob.objects.filter(group_domain=domain).first()
        if latest:
            if latest.status in ACTIVE:
                return latest
            due_since = latest.finished_at or latest.created_at
        else:
            state = VkParserState.objects.order_by('pk').first()
            due_since = state.last_run_at if state and state.group_domain in ('', domain) else None
        if due_since and due_since + timedelta(seconds=settings.VK_IMPORT_INTERVAL_SECONDS) > timezone.now():
            return None
        return enqueue(trigger='schedule')[0]


def process_job(job_id, *, retry=True):
    job = VkImportJob.objects.get(pk=job_id)
    with group_lock(job.group_domain) as acquired:
        if not acquired:
            return None
        with transaction.atomic():
            job = VkImportJob.objects.select_for_update().get(pk=job_id)
            if job.status not in ACTIVE or job.available_at > timezone.now():
                return None
            # Полученная session lock доказывает, что прошлый процесс больше не
            # исполняет импорт: heartbeat не используется как единственное основание.
            max_attempts = max(1, min(settings.VK_IMPORT_MAX_ATTEMPTS, 10))
            if job.attempts >= max_attempts:
                job.status = 'partial' if job.stats.get('comments', 0) else 'failed'
                job.error = 'Превышено число попыток после прерывания worker.'
                job.stage = 'Импорт прерван'
                job.finished_at = timezone.now()
                job.save()
                return job
            job.status = 'running'
            job.attempts += 1
            job.started_at = job.started_at or timezone.now()
            job.heartbeat_at = timezone.now()
            job.error = ''
            job.stage = 'Запуск импорта'
            job.save()
        stats = dict(job.stats)
        def progress(stage, current_stats=None):
            if current_stats is not None:
                stats.update(current_stats)
            # При сохранении отзыва прогресс пишется в той же короткой транзакции.
            VkImportJob.objects.filter(pk=job.pk).update(stage=stage, stats=dict(stats), heartbeat_at=timezone.now())
        try:
            mode, domain = configured_backend()
            if domain != job.group_domain or mode != job.backend:
                raise VkParserError('Настройки VK изменились после постановки задания. Запустите новое обновление.')
            backend = _select_backend(job.backend, progress)
            import_reviews(job.full, backend=backend, progress=progress, stats=stats)
        except VkParserError as exc:
            job.error = str(exc)[:500]
            if retry and exc.retryable and job.attempts < max_attempts:
                job.status = 'pending'
                job.stage = 'Ожидает повторной попытки'
                job.available_at = timezone.now() + timedelta(seconds=min(30 * 2 ** (job.attempts - 1), 300))
            else:
                job.status = 'partial' if exc.partial or stats.get('comments', 0) else 'failed'
                job.stage = 'Завершено не полностью' if job.status == 'partial' else 'Ошибка импорта'
                job.finished_at = timezone.now()
        except Exception:
            # Не возвращаем строку исключения: сетевые библиотеки могут включать секреты.
            logger.error('Unexpected VK import failure for job %s (details withheld)', job.pk)
            job.error = 'Внутренняя ошибка импорта. Сохранённые отзывы не удалены.'
            job.status = 'partial' if stats.get('comments', 0) else 'failed'
            job.stage = 'Ошибка импорта'
            job.finished_at = timezone.now()
        else:
            job.status = 'success'
            job.stage = 'Завершено'
            job.finished_at = timezone.now()
        job.stats = stats
        job.heartbeat_at = timezone.now()
        job.save(update_fields=['status', 'stage', 'stats', 'error', 'available_at', 'heartbeat_at', 'finished_at'])
        return job


def worker_tick():
    schedule_if_due()
    stale = timezone.now() - timedelta(seconds=max(60, settings.VK_IMPORT_STALE_SECONDS))
    jobs = VkImportJob.objects.filter(available_at__lte=timezone.now()).filter(
        Q(status='pending') |
        Q(status='running', heartbeat_at__lt=stale)
    ).order_by('id').values_list('pk', flat=True)[:20]
    for pk in list(jobs):
        result = process_job(pk)
        if result:
            return result
    return None


def run_sync(full=False):
    job, created = enqueue(full=full, trigger='cli')
    if not created:
        raise VkParserError('Импорт уже ожидает запуска или выполняется.')
    result = process_job(job.pk, retry=False)
    if result is None or result.status != 'success':
        raise VkParserError(result.error if result else 'Импорт уже выполняется другим процессом.')
    return result.stats
