import datetime
import importlib
import io
import json
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import Mock, patch
from urllib.error import URLError

from django.apps import apps
from django.conf import settings
from django.core.management import call_command, CommandError
from django.db import connection, connections
from django.test import TestCase, SimpleTestCase, TransactionTestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from .models import SiteReview, VkImportJob, VkParserState, User
from .vk_parser import ApiBackend, HtmlBackend, Transport, VkParserError, configured_backend, import_reviews, _parse_ru_date, _ssl_context
from .vk_jobs import enqueue, process_job, worker_tick, schedule_if_due, group_lock, status_data, run_sync

VK_SETTINGS = dict(VK_IMPORT_BACKEND='api', VK_ACCESS_TOKEN='fake-test-token', VK_SESSION_COOKIE='',
                   VK_GROUP_DOMAIN='test_theatre', VK_IMPORT_REQUEST_INTERVAL=0, VK_IMPORT_HTTP_ATTEMPTS=1,
                   VK_IMPORT_INTERVAL_SECONDS=1209600, VK_IMPORT_MAX_ATTEMPTS=3, VK_IMPORT_STALE_SECONDS=60)


def api_comment(cid):
    return {'id': cid, 'from_id': 7, 'text': 'Полный отзыв ' + 'я' * 300, 'date': 1735750800}


def html_comment(text='Полный <b>текст</b><br>отзыва', cid=123):
    return f'<div class="pi_text">Поделитесь впечатлениями</div><div class="replies"><div id="wr_reply-10_{cid}" class="reply"><a class="reply_author" href="/id7">Зритель</a><time datetime="2025-01-01T20:00:00Z"></time><div class="reply_text">{text}</div></div></div>'


class FakeBackend:
    domain = 'test_theatre'
    def iter_posts(self, full):
        self.full = full
        return [{'owner_id': -10, 'post_id': 20, 'text': 'Поделитесь впечатлениями'}]
    def get_comments(self, post):
        return [{'comment_id': 123, 'name': 'Автор', 'text': 'Длинный отзыв', 'date': datetime.date(2025, 1, 1)}]


@override_settings(**VK_SETTINGS)
class ParserTransportTests(SimpleTestCase):
    def test_paginates_all_comments_and_requests_untruncated_text(self):
        backend = ApiBackend()
        responses = [{'count': 150, 'items': [api_comment(i) for i in range(1, 101)], 'profiles': [{'id': 7, 'first_name': 'Имя', 'last_name': 'Фамилия'}]},
                     {'count': 150, 'items': [api_comment(i) for i in range(101, 151)]}]
        with patch.object(backend, '_call', side_effect=responses) as call:
            result = list(backend.get_comments({'owner_id': -10, 'post_id': 20}))
        self.assertEqual(len(result), 150)
        self.assertGreater(len(result[0]['text']), 300)
        self.assertEqual(result[0]['name'], 'Имя Фамилия')
        self.assertEqual([c.args[1]['offset'] for c in call.call_args_list], [0, 100])
        self.assertTrue(all(c.args[1]['preview_length'] == 0 for c in call.call_args_list))
        self.assertTrue(all(c.args[1]['thread_items_count'] == 0 for c in call.call_args_list))

    def test_only_latest_twenty_wall_posts_normally(self):
        backend = ApiBackend()
        with patch.object(backend, '_call', return_value={'count': 1000, 'items': [{'id': i, 'owner_id': -10, 'text': ''} for i in range(20)]}) as call:
            self.assertEqual(len(backend.iter_posts(False)), 20)
        call.assert_called_once_with('wall.get', {'domain': 'test_theatre', 'count': 20, 'offset': 0})

    def test_nested_reply_count_does_not_require_extra_top_level_pages(self):
        backend = ApiBackend()
        with patch.object(backend, '_call', return_value={'count': 200, 'current_level_count': 1, 'items': [api_comment(1)]}) as call:
            self.assertEqual(len(list(backend.get_comments({'owner_id': -10, 'post_id': 20}))), 1)
            self.assertEqual(call.call_count, 1)

    def test_repeated_or_empty_page_not_reported_as_complete(self):
        for items in [[], [api_comment(1)]]:
            backend = ApiBackend()
            with patch.object(backend, '_call', return_value={'count': 2, 'items': items}):
                with self.assertRaises(VkParserError):
                    list(backend.get_comments({'owner_id': -10, 'post_id': 20}))

    def test_limit_is_explicit_partial_error(self):
        backend = ApiBackend()
        with override_settings(VK_IMPORT_MAX_COMMENTS=100), patch.object(backend, '_call', return_value={'count': 101, 'items': [api_comment(i) for i in range(1, 101)]}):
            with self.assertRaises(VkParserError) as error:
                list(backend.get_comments({'owner_id': -10, 'post_id': 20}))
        self.assertTrue(error.exception.partial)

    def test_nested_deleted_and_group_comments_skipped(self):
        backend = ApiBackend()
        comments = [dict(api_comment(1), parents_stack=[2]), dict(api_comment(2), deleted=True), dict(api_comment(3), from_id=-10), api_comment(4)]
        with patch.object(backend, '_call', return_value={'count': 4, 'items': comments}):
            result = list(backend.get_comments({'owner_id': -10, 'post_id': 20}))
        self.assertEqual(sum(bool(c.get('skip')) for c in result), 3)
        self.assertEqual(result[-1]['comment_id'], 4)

    def test_api_posts_token_in_body_and_rejects_missing_response(self):
        backend = ApiBackend()
        with patch.object(backend, 'request', return_value='{}') as request:
            with self.assertRaises(VkParserError): backend._call('wall.get', {})
        req = request.call_args.args[0]
        self.assertNotIn('fake-test-token', req.full_url)
        self.assertIn(b'fake-test-token', req.data)
        self.assertEqual(req.get_method(), 'POST')

    def test_vk_error_message_cannot_leak_token_and_retry_is_bounded(self):
        backend = ApiBackend()
        with patch.object(backend, 'request', return_value=json.dumps({'error': {'error_code': 5, 'error_msg': 'secret-token'}})):
            with self.assertRaises(VkParserError) as error: backend._call('wall.get', {})
        self.assertNotIn('secret-token', str(error.exception))
        with override_settings(VK_IMPORT_HTTP_ATTEMPTS=2), patch.object(backend, 'request', return_value=json.dumps({'error': {'error_code': 6}})) as request, patch('my_app1.vk_parser.time.sleep'):
            with self.assertRaises(VkParserError) as error: backend._call('wall.get', {})
        self.assertEqual(request.call_count, 2)
        self.assertTrue(error.exception.retryable)

    def test_network_failure_safe_and_retried(self):
        with override_settings(VK_IMPORT_HTTP_ATTEMPTS=2), patch('my_app1.vk_parser._urlopen', side_effect=URLError('secret-cookie')), patch('my_app1.vk_parser.time.sleep'):
            with self.assertRaises(VkParserError) as error: Transport().request('https://api.vk.com')
        self.assertNotIn('secret-cookie', str(error.exception))
        self.assertTrue(error.exception.retryable)

    @override_settings(VK_SESSION_COOKIE='cookie', VK_ACCESS_TOKEN='token', VK_IMPORT_BACKEND='auto')
    def test_legacy_selection_kept_and_explicit_mode_supported(self):
        self.assertEqual(configured_backend()[0], 'html')
        with override_settings(VK_IMPORT_BACKEND='api'): self.assertEqual(configured_backend()[0], 'api')
        with override_settings(VK_IMPORT_BACKEND='wrong'):
            with self.assertRaises(VkParserError): configured_backend()

    @override_settings(VK_SSL_VERIFY=False)
    def test_tls_cannot_be_disabled(self):
        import ssl
        context = _ssl_context()
        self.assertTrue(context.check_hostname)
        self.assertEqual(context.verify_mode, ssl.CERT_REQUIRED)

    def test_html_real_id_survives_text_edits_and_inline_tags(self):
        first = HtmlBackend._extract_comments(html_comment(), -10, 20)[0]
        second = HtmlBackend._extract_comments(html_comment('Редактирование'), -10, 20)[0]
        self.assertEqual(first['comment_id'], 123)
        self.assertEqual(first['comment_id'], second['comment_id'])
        self.assertEqual(first['text'], 'Полный текст\nотзыва')
        self.assertEqual(first['date'], datetime.date(2025, 1, 2))

    def test_html_without_id_skipped_not_hashed(self):
        result = HtmlBackend._extract_comments(html_comment().replace('id="wr_reply-10_123"', ''), -10, 20)
        self.assertEqual(result, [{'skip': True}])

    def test_html_detects_login_captcha_and_unrecognized_markup(self):
        for html in ['<form action="/login"><input name="password"></form>', '<input name="captcha_key">', '<html>Войдите в VK</html>']:
            with self.subTest(html=html), self.assertRaises(VkParserError): HtmlBackend._extract_post_ids(html)
        self.assertEqual(HtmlBackend._extract_post_ids('<div class="wall_empty"></div>'), [])

    @override_settings(VK_SESSION_COOKIE='cookie')
    def test_html_reuses_page_and_paginates(self):
        backend = HtmlBackend()
        post = {'owner_id': -10, 'post_id': 20}
        pages = [html_comment() + '<a class="pg_next" href="/wall-10_20?offset=1">Далее</a>', html_comment('Другой', 124)]
        with patch.object(backend, '_fetch', side_effect=pages) as fetch:
            backend.enrich_text(post)
            result = list(backend.get_comments(post))
        self.assertEqual(fetch.call_count, 2)
        self.assertEqual([c['comment_id'] for c in result], [123, 124])

    def test_unknown_year_does_not_fabricate_date(self):
        self.assertIsNone(_parse_ru_date('31 дек'))
        self.assertEqual(_parse_ru_date('31 дек 2025'), datetime.date(2025, 12, 31))


@override_settings(**VK_SETTINGS)
class ParserStorageTests(TestCase):
    def setUp(self):
        SiteReview.objects.all().delete()
        self.backend = FakeBackend()
        self.client = APIClient()
        self.admin = User.objects.create_superuser(password='test', email='vk-admin@test.invalid')
        self.client.force_authenticate(self.admin)

    def test_import_is_automatic_idempotent_preserves_hidden_pin_and_updates_text(self):
        result = import_reviews(backend=self.backend)
        review = SiteReview.objects.get()
        self.assertTrue(result['full'])
        self.assertFalse(review.hidden or review.excluded)
        self.assertIsNone(review.rating)
        self.assertEqual(review.source_url, 'https://vk.com/wall-10_20?reply=123')
        review.hidden = True; review.pinned = True; review.text = 'Правка'; review.save()
        import_reviews(backend=self.backend)
        review.refresh_from_db()
        self.assertEqual(SiteReview.objects.count(), 1)
        self.assertTrue(review.hidden and review.pinned)
        self.assertEqual(review.text, 'Длинный отзыв')
        self.assertFalse(self.backend.full)

    def test_deleted_import_does_not_return_and_can_restore(self):
        import_reviews(backend=self.backend)
        review = SiteReview.objects.get()
        self.assertEqual(self.client.delete(f'/site-review{review.pk}/').status_code, 204)
        import_reviews(backend=self.backend)
        review.refresh_from_db()
        self.assertTrue(review.excluded)
        self.assertEqual(self.client.get('/site-reviews/').data, [])
        self.assertEqual(self.client.put(f'/site-review{review.pk}/', {'excluded': False}, format='json').status_code, 200)
        self.assertEqual(len(self.client.get('/site-reviews/').data), 1)

    def test_partial_failure_preserves_saved_review_but_not_initial_success(self):
        def comments(post):
            yield self.backend.get_comments(post)[0]
            raise VkParserError('Оборвано', retryable=True)
        other = FakeBackend(); other.get_comments = comments
        with self.assertRaises(VkParserError): import_reviews(backend=other)
        self.assertEqual(SiteReview.objects.count(), 1)
        self.assertFalse(VkParserState.get_solo().initial_done)

    def test_failed_progress_write_rolls_back_review_and_added_counter(self):
        stats = {}
        def fail(stage, current=None):
            if stage == 'Сохранение отзывов':
                raise VkParserError('Ошибка записи прогресса')
        with self.assertRaises(VkParserError):
            import_reviews(backend=self.backend, progress=fail, stats=stats)
        self.assertEqual(SiteReview.objects.count(), 0)
        self.assertEqual(stats['added'], 0)

    def test_expanded_scan_limit_does_not_discard_processed_reviews(self):
        self.backend.truncated_wall = True
        with self.assertRaises(VkParserError) as error:
            import_reviews(backend=self.backend)
        self.assertTrue(error.exception.partial)
        self.assertEqual(SiteReview.objects.count(), 1)
        self.assertFalse(VkParserState.get_solo().initial_done)

    def test_unknown_dates_last_and_six_limit(self):
        for i in range(8): SiteReview.objects.create(author_name='Автор', text='Текст', source='manual', review_date=datetime.date(2025, 1, i+1))
        SiteReview.objects.create(author_name='Без даты', text='Текст')
        response = self.client.get('/site-reviews/')
        self.assertEqual(len(response.data), 6)
        self.assertNotIn('Без даты', [r['author_name'] for r in response.data])

    def test_precise_demo_cleanup_preserves_real_and_modified(self):
        migration = importlib.import_module('my_app1.migrations.0028_remove_demo_site_reviews')
        for name, role, text, date in migration.SEED:
            SiteReview.objects.create(author_name=name, role=role, text=text, review_date=date, rating=5, source='manual')
        name, role, text, date = migration.SEED[0]
        modified = SiteReview.objects.create(author_name=name, role=role, text=text+'!', review_date=date, rating=5, source='manual')
        real = SiteReview.objects.create(author_name=name, role=role, text=text, review_date=date, rating=5, source='vk', vk_owner_id=-10, vk_post_id=20, vk_comment_id=123)
        manual = SiteReview.objects.create(author_name='Другой', text='Настоящий ручной', source='manual', rating=4)
        migration.cleanup(apps, None)
        self.assertEqual(set(SiteReview.objects.values_list('pk', flat=True)), {modified.pk, real.pk, manual.pk})
        real.refresh_from_db(); manual.refresh_from_db()
        self.assertIsNone(real.rating); self.assertEqual(manual.rating, 4)

    def test_manual_rating_range_validation(self):
        self.assertEqual(self.client.post('/site-reviews-admin/', {'author_name':'А', 'text':'Т', 'rating':9}, format='json').status_code, 400)


@override_settings(**VK_SETTINGS)
class JobTests(TransactionTestCase):
    reset_sequences = True
    def setUp(self):
        self.backend = FakeBackend()

    def test_enqueue_and_api_do_not_run_network(self):
        admin = User.objects.create_superuser(password='test', email='queue@test.invalid')
        client = APIClient(); client.force_authenticate(admin)
        with patch('my_app1.vk_parser._urlopen') as network:
            response = client.post('/vk-reviews/parse/', {}, format='json')
            self.assertEqual(response.status_code, 202)
            second = client.post('/vk-reviews/parse/', {}, format='json')
            self.assertEqual(response.data['job']['id'], second.data['job']['id'])
            self.assertFalse(second.data['created'])
            self.assertEqual(client.get('/vk-reviews/parse/').status_code, 200)
            network.assert_not_called()

    def test_worker_success_schedule_and_last_success(self):
        job = schedule_if_due()
        with patch('my_app1.vk_jobs._select_backend', return_value=self.backend): result = worker_tick()
        self.assertEqual(result.status, 'success')
        self.assertIsNone(schedule_if_due())
        self.assertIsNotNone(status_data()['last_success_at'])
        self.assertEqual(SiteReview.objects.get().rating, None)

    def test_schedule_disabled_and_missing_credentials_do_not_fail(self):
        with override_settings(VK_ACCESS_TOKEN='', VK_IMPORT_BACKEND='auto'):
            self.assertIsNone(worker_tick()); self.assertFalse(status_data()['configured'])
        with override_settings(VK_IMPORT_INTERVAL_SECONDS=0): self.assertIsNone(schedule_if_due())

    def test_transient_retry_records_stats_and_safely_reimports(self):
        job, _ = enqueue()
        def fail(post):
            yield self.backend.get_comments(post)[0]
            raise VkParserError('Сеть недоступна', retryable=True)
        broken = FakeBackend(); broken.get_comments = fail
        with patch('my_app1.vk_jobs._select_backend', return_value=broken): first = process_job(job.pk)
        self.assertEqual(first.status, 'pending')
        self.assertEqual(first.stats['added'], 1)
        self.assertIsNone(first.finished_at)
        VkImportJob.objects.filter(pk=job.pk).update(available_at=timezone.now())
        with patch('my_app1.vk_jobs._select_backend', return_value=self.backend): second = process_job(job.pk)
        self.assertEqual(second.status, 'success')
        self.assertEqual(second.attempts, 2)
        self.assertEqual(second.stats['added'], 1)
        self.assertEqual(SiteReview.objects.count(), 1)

    def test_permanent_failure_and_cli_nonzero(self):
        job, _ = enqueue()
        with patch('my_app1.vk_jobs._select_backend', side_effect=VkParserError('VK требует вход')):
            result = process_job(job.pk)
        self.assertEqual(result.status, 'failed')
        self.assertFalse(VkParserState.objects.exists())
        with patch('my_app1.management.commands.parse_vk_reviews.parse_reviews', side_effect=VkParserError('Ошибка')):
            with self.assertRaises(CommandError): call_command('parse_vk_reviews', stdout=io.StringIO(), stderr=io.StringIO())

    def test_worker_once_failure_returns_nonzero(self):
        job, _ = enqueue()
        with patch('my_app1.management.commands.vk_reviews_worker.worker_tick', return_value=VkImportJob(status='failed', error='Ошибка доступа')):
            with self.assertRaises(CommandError):
                call_command('vk_reviews_worker', once=True, stdout=io.StringIO(), stderr=io.StringIO())

    def test_interrupted_job_recovered_and_attempts_bounded(self):
        job, _ = enqueue()
        VkImportJob.objects.filter(pk=job.pk).update(status='running', attempts=1, heartbeat_at=timezone.now()-datetime.timedelta(minutes=10))
        with patch('my_app1.vk_jobs._select_backend', return_value=self.backend): result = worker_tick()
        self.assertEqual(result.status, 'success'); self.assertEqual(result.attempts, 2)
        job, _ = enqueue()
        VkImportJob.objects.filter(pk=job.pk).update(status='running', attempts=3, heartbeat_at=timezone.now()-datetime.timedelta(minutes=10))
        self.assertEqual(worker_tick().status, 'failed')

    def test_parallel_enqueue_has_one_active_job(self):
        def submit():
            try: return enqueue()[0].pk
            finally: connections.close_all()
        with ThreadPoolExecutor(max_workers=2) as pool: ids = list(pool.map(lambda _: submit(), range(2)))
        self.assertEqual(ids[0], ids[1]); self.assertEqual(VkImportJob.objects.count(), 1)

    def test_live_session_lock_prevents_stale_job_theft(self):
        job, _ = enqueue()
        VkImportJob.objects.filter(pk=job.pk).update(status='running', heartbeat_at=timezone.now()-datetime.timedelta(hours=1))
        def try_work():
            try: return process_job(job.pk)
            finally: connections.close_all()
        with group_lock(job.group_domain) as acquired:
            self.assertTrue(acquired)
            with ThreadPoolExecutor(max_workers=1) as pool: result = pool.submit(try_work).result(timeout=10)
            self.assertIsNone(result)
        self.assertEqual(VkImportJob.objects.get(pk=job.pk).attempts, 0)
