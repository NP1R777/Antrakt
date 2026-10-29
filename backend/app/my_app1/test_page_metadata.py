import io
import json
from unittest.mock import patch

from bs4 import BeautifulSoup
from django.test import TestCase, SimpleTestCase, override_settings
from django.utils import timezone

from .models import Perfomances, Archive, News
from .page_metadata import metadata_for_path, render_spa, load_spa_index

INDEX = '''<!doctype html><html lang="ru"><head><title>Old</title><meta name="description" content="old"><meta property="og:title" content="old"><link rel="canonical" href="https://old.example/"><link href="/static/css/main.hash.css" rel="stylesheet"><script defer src="/static/js/main.hash.js"></script></head><body><noscript>Включите JavaScript</noscript><div id="root"></div></body></html>'''


@override_settings(FRONTEND_BASE_URL='https://theatre.example')
class PageMetadataTests(TestCase):
    def setUp(self):
        self.performance = Perfomances.objects.create(title='Премьера', author='А', genre='Драма', age_limit='12+', description='<p>Полное описание спектакля.</p>', image_url='https://s3.example/poster.jpg', afisha=True)
        self.project = Archive.objects.create(id=self.performance.pk, title='Проект', description='Описание проекта', afisha=False, image_url='https://s3.example/project.jpg')
        self.news = News.objects.create(title='Новость', description='Текст новости', is_published=True, image_url='https://s3.example/news.jpg')

    def test_original_html_contains_unique_record_tags_and_working_assets_without_js(self):
        with patch('my_app1.page_metadata.load_spa_index', return_value=INDEX):
            response = self.client.get(f'/public-page/afisha/performance/{self.performance.pk}', HTTP_USER_AGENT='vkShare')
        self.assertEqual(response.status_code, 200)
        soup = BeautifulSoup(response.content, 'html.parser')
        self.assertEqual(soup.find('meta', property='og:title')['content'], 'Премьера — Норильский народный театр')
        self.assertEqual(soup.find('meta', property='og:image')['content'], self.performance.image_url)
        self.assertEqual(soup.find('meta', property='og:description')['content'], 'Полное описание спектакля.')
        self.assertEqual(soup.find('link', rel='canonical')['href'], f'https://theatre.example/afisha/performance/{self.performance.pk}')
        self.assertEqual(len(soup.select('title')), 1)
        self.assertEqual(len(soup.select('meta[property="og:title"]')), 1)
        self.assertEqual(soup.find('script', src=True)['src'], '/static/js/main.hash.js')
        self.assertTrue(soup.find('script', src=True).has_attr('defer'))
        self.assertIsNotNone(soup.find(id='root'))
        self.assertEqual(json.loads(soup.find(id='page-metadata').string)['path'], f'/afisha/performance/{self.performance.pk}')
        self.assertEqual(response['Cache-Control'], 'no-store')

    def test_same_html_for_bots_and_people(self):
        with patch('my_app1.page_metadata.load_spa_index', return_value=INDEX):
            human = self.client.get(f'/public-page/news/{self.news.pk}', HTTP_USER_AGENT='Mozilla/5.0')
            robot = self.client.get(f'/public-page/news/{self.news.pk}', HTTP_USER_AGENT='vkShare')
        self.assertEqual(human.content, robot.content)

    def test_news_projects_and_performance_ids_do_not_mix(self):
        for path, image in [(f'/news/{self.news.pk}', self.news.image_url), (f'/projects/{self.project.pk}', self.project.image_url), (f'/afisha/performance/{self.performance.pk}', self.performance.image_url)]:
            data = self.client.get('/page-metadata/', {'path': path}).json()
            self.assertEqual(data['image'], image)
            self.assertEqual(data['canonical'], 'https://theatre.example'+path)
        self.assertEqual(metadata_for_path(f'/news/{self.news.pk}')['type'], 'article')

    def test_draft_and_deleted_records_never_expose_metadata(self):
        self.news.is_published = False; self.news.save()
        self.performance.deleted_at = timezone.now(); self.performance.save(update_fields=['deleted_at'])
        self.project.deleted_at = timezone.now(); self.project.save(update_fields=['deleted_at'])
        for path in [f'/news/{self.news.pk}', f'/afisha/performance/{self.performance.pk}', f'/projects/{self.project.pk}']:
            with patch('my_app1.page_metadata.load_spa_index', return_value=INDEX):
                response = self.client.get('/public-page'+path)
            self.assertEqual(response.status_code, 404)
            self.assertNotIn('s3.example', response.content.decode())
            self.assertIn('noindex', response['X-Robots-Tag'])
            self.assertIsNone(metadata_for_path(path)['canonical'])

    def test_redirects_follow_afisha_state_and_legacy_archive(self):
        response = self.client.get(f'/public-page/performance/{self.performance.pk}')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response['Location'], f'https://theatre.example/afisha/performance/{self.performance.pk}')
        self.performance.afisha = False; self.performance.save(update_fields=['afisha'])
        response = self.client.get(f'/public-page/afisha/performance/{self.performance.pk}')
        self.assertEqual(response['Location'], f'https://theatre.example/performance/{self.performance.pk}')
        response = self.client.get(f'/public-page/archive/{self.project.pk}')
        self.assertEqual(response['Location'], f'https://theatre.example/projects/{self.project.pk}')

    def test_tracking_and_host_do_not_pollute_canonical(self):
        data = self.client.get('/page-metadata/', {'path': f'/news/{self.news.pk}/?utm_source=vk#token=secret'}, HTTP_HOST='attacker.example').json()
        self.assertEqual(data['canonical'], f'https://theatre.example/news/{self.news.pk}')
        self.assertNotIn('secret', json.dumps(data))
        self.assertNotIn('attacker.example', json.dumps(data))

    def test_private_pages_noindex_without_user_queries(self):
        for path in ['/profile/7', '/reset-password', '/admin/site-reviews']:
            with self.assertNumQueries(0): data = metadata_for_path(path)
            self.assertTrue(data['noindex']); self.assertIsNone(data['canonical'])
            self.assertEqual(data['status'], 200)

    def test_404_keeps_spa_shell_and_unsafe_images_fall_back_to_local_logo(self):
        self.news.image_url = 'javascript:alert(1)'; self.news.save()
        self.assertEqual(metadata_for_path(f'/news/{self.news.pk}')['image'], 'https://theatre.example/logo512.png')
        with patch('my_app1.page_metadata.load_spa_index', return_value=INDEX): response = self.client.get('/public-page/not-a-real-page')
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'id="root"', response.content)

    def test_escaping_prevents_content_from_injecting_head_tags(self):
        self.news.title = 'Новость "</title><script>alert(1)</script>'
        self.news.description = '<script>SECRET</script><p>Описание &amp; текст</p>'
        self.news.save()
        html = render_spa(INDEX, metadata_for_path(f'/news/{self.news.pk}'))
        self.assertNotIn('SECRET', html)
        self.assertNotIn('<script>alert(1)</script>', html)
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(len(soup.find_all('script')), 2)
        self.assertEqual(soup.find('meta', property='og:description')['content'], 'Описание & текст')

    def test_json_path_is_escaped_against_script_termination(self):
        data = metadata_for_path('/missing/</script><script>alert(1)</script>')
        html = render_spa(INDEX, data)
        self.assertEqual(len(BeautifulSoup(html, 'html.parser').find_all('script')), 2)
        self.assertEqual(json.loads(BeautifulSoup(html, 'html.parser').find(id='page-metadata').string)['path'], data['path'])

    def test_failed_or_unbuilt_index_is_503_not_fake_success(self):
        for side_effect in [OSError('unavailable'), ValueError('invalid')]:
            with patch('my_app1.page_metadata.load_spa_index', side_effect=side_effect): response = self.client.get('/public-page/news')
            self.assertEqual(response.status_code, 503)
            self.assertEqual(response['X-Robots-Tag'], 'noindex')
        with patch('my_app1.page_metadata.load_spa_index', return_value='<html>wrong</html>'):
            self.assertEqual(self.client.get('/public-page/').status_code, 503)

    def test_new_content_is_immediately_visible_without_rebuild(self):
        first = metadata_for_path(f'/news/{self.news.pk}')
        self.news.title = 'Обновлённая новость'; self.news.save()
        second = metadata_for_path(f'/news/{self.news.pk}')
        self.assertNotEqual(first['title'], second['title'])


@override_settings(PUBLIC_SPA_INDEX_URL='http://frontend/index.html')
class IndexFetchTests(SimpleTestCase):
    def test_only_configured_index_fetched_with_bounded_timeout(self):
        response = io.BytesIO(INDEX.encode()); response.status = 200
        opener = type('Opener', (), {'open': lambda *args, **kwargs: response})()
        with patch('my_app1.page_metadata.urllib.request.build_opener', return_value=opener): self.assertEqual(load_spa_index(), INDEX)
