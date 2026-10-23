from unittest.mock import patch
from io import BytesIO
from PIL import Image
from urllib.parse import urlencode

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Actors, User, News, Review, Perfomances


class ApiAccessTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(password='p', email='reader@test.com')
        cls.other = User.objects.create_user(password='p', email='other@test.com')
        cls.admin = User.objects.create_superuser(password='p', email='admin@test.com')
        cls.staff = User.objects.create_user(password='p', email='staff@test.com', is_staff=True)
        cls.actor = Actors.objects.create(name='Актёр', favorite_quote='Цитата', author_quote='Автор', image_url='')
        cls.performance = Perfomances.objects.create(title='Спектакль', author='А', genre='Драма', age_limit='12+', description='Описание', afisha=False)
        cls.news = News.objects.create(title='Черновик', description='Описание', is_published=False)
        cls.review = Review.objects.create(author=cls.user, performance=cls.performance, text='Отзыв')

    def setUp(self):
        self.client = APIClient()

    def test_content_writes_require_superuser(self):
        # Permission checks must run before validation or object lookup, including hard deletion.
        collections = ['perfomances', 'actors', 'directors', 'news', 'archive', 'achievements']
        details = ['perfomance', 'actor', 'director', 'news', 'archive', 'achievement']
        for user, expected in [(None, 401), (self.user, 403), (self.staff, 403)]:
            self.client.force_authenticate(user)
            for name in collections:
                with self.subTest(user=user, url=name):
                    self.assertEqual(self.client.post(f'/{name}/', {}, format='json').status_code, expected)
            for name in details:
                for method in ['put', 'patch', 'delete']:
                    with self.subTest(user=user, url=name, method=method):
                        response = getattr(self.client, method)(f'/{name}999999/?hard=1', {}, format='json')
                        self.assertEqual(response.status_code, expected)
            self.assertEqual(self.client.put('/site-content/', {'items': []}, format='json').status_code, expected)
        self.actor.refresh_from_db()
        self.assertIsNone(self.actor.deleted_at)

    def test_administrative_routes_are_private(self):
        routes = ['users', 'users-admin', 'perfomances-admin', 'actors-admin', 'directors-admin', 'news-admin', 'archive-admin', 'achievements-admin', 'reviews-admin', 'site-reviews-admin', 'actor-birthdays', 'birthday-greetings']
        for user, expected in [(None, 401), (self.user, 403), (self.staff, 403), (self.admin, 200)]:
            self.client.force_authenticate(user)
            for route in routes:
                with self.subTest(user=user, route=route):
                    self.assertEqual(self.client.get(f'/{route}/').status_code, expected)

    @patch('my_app1.vk_parser.parse_reviews', return_value={'created': 0})
    def test_vk_import_requires_admin_before_running_parser(self, parse):
        for user, expected in [(None, 401), (self.user, 403), (self.admin, 200)]:
            self.client.force_authenticate(user)
            self.assertEqual(self.client.post('/vk-reviews/parse/', {}, format='json').status_code, expected)
        parse.assert_called_once_with(full=False)

    def test_birthday_and_site_review_writes_require_admin(self):
        requests = [('post', '/actor-birthdays/'), ('put', '/actor-birthday999999/'), ('delete', '/actor-birthday999999/'), ('post', '/birthday-greetings/'), ('put', '/birthday-greeting999999/'), ('delete', '/birthday-greeting999999/'), ('post', '/site-reviews-admin/'), ('put', '/site-review999999/'), ('delete', '/site-review999999/')]
        for user, expected in [(None, 401), (self.user, 403)]:
            self.client.force_authenticate(user)
            for method, url in requests:
                with self.subTest(user=user, method=method, url=url):
                    self.assertEqual(getattr(self.client, method)(url, {}, format='json').status_code, expected)

    def test_public_reads_and_admin_content_management(self):
        for url in ['/actors/', f'/actor{self.actor.pk}/', '/perfomances/', '/afisha/', '/site-content/', '/birthday-today/', '/site-reviews/']:
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 200)
        self.client.force_authenticate(self.admin)
        response = self.client.post('/actors/', {'name': 'Новый', 'favorite_quote': 'Цитата', 'author_quote': 'Автор', 'image_url': ''}, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        pk = response.data['id']
        self.assertEqual(self.client.put(f'/actor{pk}/', {'name': 'Изменён'}, format='json').status_code, 200)
        self.assertEqual(self.client.delete(f'/actor{pk}/').status_code, 204)
        self.assertEqual(self.client.get(f'/actor{pk}/').status_code, 200)
        self.assertEqual(self.client.put(f'/actor{pk}/', {'deleted_at': None}, format='json').status_code, 200)
        self.assertEqual(self.client.put('/site-content/', {'items': []}, format='json').status_code, 200)
        self.assertEqual(self.client.delete(f'/actor{pk}/?hard=1').status_code, 204)
        self.assertFalse(Actors.objects.filter(pk=pk).exists())

    def test_hidden_content_and_its_reviews_are_not_public(self):
        self.actor.deleted_at = timezone.now()
        self.actor.save()
        for user in [None, self.user]:
            self.client.force_authenticate(user)
            for url in [f'/actor{self.actor.pk}/', f'/actor{self.actor.pk}/reviews/', f'/news{self.news.pk}/', f'/news{self.news.pk}/reviews/']:
                with self.subTest(user=user, url=url):
                    self.assertEqual(self.client.get(url).status_code, 404)
            if user:
                self.assertEqual(self.client.post(f'/news{self.news.pk}/reviews/', {'text': 'Отзыв'}, format='json').status_code, 404)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get(f'/news{self.news.pk}/').status_code, 200)
        self.assertEqual(self.client.get(f'/actor{self.actor.pk}/').status_code, 200)

    def test_profile_ownership_and_privileged_fields(self):
        self.client.force_authenticate(self.user)
        for method in ['get', 'put', 'delete']:
            response = getattr(self.client, method)(f'/user{self.other.pk}/')
            self.assertEqual(response.status_code, 403)
        for field, value in [('is_superuser', True), ('deleted_at', None), ('password', 'Replacement1!')]:
            with self.subTest(field=field):
                self.assertEqual(self.client.put(f'/user{self.user.pk}/', {field: value}, format='json').status_code, 400)
        response = self.client.put(f'/user{self.user.pk}/', {'profile_photo': 'https://example.com/avatar.png'}, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_superuser)
        self.assertTrue(self.user.check_password('p'))

    def test_reviews_remain_available_to_their_author(self):
        url = f'/perfomance{self.performance.pk}/reviews/'
        self.assertEqual(self.client.get(url).status_code, 200)
        self.assertEqual(self.client.post(url, {'text': 'Новый'}, format='json').status_code, 401)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.post(url, {'text': 'Новый'}, format='json').status_code, 201)
        self.assertEqual(self.client.delete(f'/review{self.review.pk}/').status_code, 403)
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.delete(f'/review{self.review.pk}/').status_code, 204)
        self.assertEqual(self.client.post(f'/review{self.review.pk}/react/', {'reaction': 'heart'}, format='json').status_code, 404)


@override_settings(MEDIA_URL='http://localhost:9000/antrakt-images/', AWS_STORAGE_BUCKET_NAME='antrakt-images', AWS_S3_ENDPOINT_URL='http://localhost:9000', AWS_S3_REGION_NAME='us-east-1', AWS_ACCESS_KEY_ID='test', AWS_SECRET_ACCESS_KEY='test')
class ImageAccessTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(password='p', email='avatar@test.com')
        self.admin = User.objects.create_superuser(password='p', email='images@test.com')

    def upload(self, **data):
        buffer = BytesIO()
        Image.new('RGB', (2, 2)).save(buffer, 'PNG')
        return self.client.post('/upload-image/', {'image': SimpleUploadedFile('avatar.png', buffer.getvalue(), content_type='image/png'), **data}, format='multipart')

    @patch('my_app1.views._minio_client')
    def test_upload_permissions_and_owner_namespace(self, s3):
        self.assertEqual(self.upload(folder='profile').status_code, 401)
        self.client.force_authenticate(self.user)
        for data in [{'folder': 'news'}, {'folder': f'profile/{self.admin.pk}'}, {'folder': 'profile', 'fixed_key': 'Общая.png'}]:
            self.assertEqual(self.upload(**data).status_code, 403)
        s3.assert_not_called()
        response = self.upload(folder='profile')
        self.assertEqual(response.status_code, 200)
        key = s3.return_value.upload_fileobj.call_args.args[2]
        self.assertTrue(key.startswith(f'profile/{self.user.pk}/'))
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.upload(folder='news').status_code, 200)
        self.assertEqual(self.upload(fixed_key='Общая.png').status_code, 200)

    @patch('my_app1.views._minio_client')
    def test_delete_only_owned_objects_on_configured_storage(self, s3):
        base = 'http://localhost:9000/antrakt-images/'
        own = base + f'profile/{self.user.pk}/avatar.png'
        self.assertEqual(self.client.delete('/delete-image/?' + urlencode({'image_url': own})).status_code, 401)
        self.client.force_authenticate(self.user)
        for url, expected in [(base+'news/photo.png', 403), (base+f'profile/{self.admin.pk}/avatar.png', 403), ('https://foreign.example/antrakt-images/photo.png', 400), (base+f'profile/{self.user.pk}/%2e%2e/photo.png', 400)]:
            with self.subTest(url=url):
                self.assertEqual(self.client.delete('/delete-image/?' + urlencode({'image_url': url})).status_code, expected)
        s3.assert_not_called()
        self.assertEqual(self.client.delete('/delete-image/?' + urlencode({'image_url': own})).status_code, 200)
        s3.return_value.delete_object.assert_called_once_with(Bucket='antrakt-images', Key=f'profile/{self.user.pk}/avatar.png')
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.delete('/delete-image/?' + urlencode({'image_url': base+'news/photo.png'})).status_code, 200)
