from io import BytesIO, StringIO
from pathlib import Path
import os
from unittest.mock import patch

from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.db import connection
from django.test.utils import CaptureQueriesContext
from rest_framework.test import APIClient

from .image_upload import normalize_image
from .models import Actors, DirectorsTheatre, Perfomances, PerformanceShow, PerformanceCast, User, Review
from .serializers import ReviewSerializer


def image_file(fmt='PNG', **kwargs):
    data = BytesIO()
    Image.new('RGB', (12, 8), 'red').save(data, fmt, **kwargs)
    return SimpleUploadedFile('untrusted.html', data.getvalue(), content_type='text/html')


class ImageNormalizationTests(TestCase):
    def test_real_pixels_determine_format_and_metadata_is_removed(self):
        exif = Image.Exif()
        exif[315] = 'Private author'
        exif[274] = 6
        result, (extension, mime) = normalize_image(image_file('JPEG', exif=exif))
        self.assertEqual((extension, mime), ('webp', 'image/webp'))
        with Image.open(result) as image:
            self.assertEqual(image.size, (8, 12))
            self.assertFalse(image.getexif())
            self.assertNotIn('icc_profile', image.info)

    def test_fixed_png_is_reencoded_as_png(self):
        result, metadata = normalize_image(image_file('JPEG'), png=True)
        self.assertEqual(metadata, ('png', 'image/png'))
        self.assertEqual(Image.open(result).format, 'PNG')

    def test_html_svg_corrupt_empty_and_oversized_uploads_are_rejected(self):
        from rest_framework.exceptions import ValidationError
        for raw in [b'', b'<html>not an image</html>', b'<svg xmlns="http://www.w3.org/2000/svg"/>', b'\x89PNG\r\n\x1a\ninvalid']:
            with self.subTest(raw=raw), self.assertRaises(ValidationError):
                normalize_image(SimpleUploadedFile('photo.png', raw, content_type='image/png'))
        with patch('my_app1.image_upload.MAX_FILE_BYTES', 10), self.assertRaises(ValidationError):
            normalize_image(image_file())
        with patch('my_app1.image_upload.MAX_PIXELS', 10), self.assertRaises(ValidationError):
            normalize_image(image_file())

    def test_animation_is_rejected_explicitly(self):
        from rest_framework.exceptions import ValidationError
        data = BytesIO()
        Image.new('RGB', (2, 2), 'red').save(data, 'GIF', save_all=True, append_images=[Image.new('RGB', (2, 2), 'blue')])
        with self.assertRaises(ValidationError):
            normalize_image(SimpleUploadedFile('animation.gif', data.getvalue()))

    @override_settings(AWS_STORAGE_BUCKET_NAME='antrakt-images', MEDIA_URL='http://localhost:9000/antrakt-images/')
    @patch('my_app1.views._minio_client')
    def test_endpoint_stores_only_normalized_image_and_rejects_before_s3(self, s3):
        client = APIClient()
        client.force_authenticate(User.objects.create_superuser(email='upload@example.invalid', password='p'))
        bad = SimpleUploadedFile('fake.png', b'<script>bad</script>', content_type='image/png')
        self.assertEqual(client.post('/upload-image/', {'image': bad}, format='multipart').status_code, 400)
        self.assertEqual(client.post('/upload-image/', {'image': image_file(), 'folder': '../profile'}, format='multipart').status_code, 400)
        s3.assert_not_called()
        response = client.post('/upload-image/', {'image': image_file()}, format='multipart')
        self.assertEqual(response.status_code, 200)
        args = s3.return_value.upload_fileobj.call_args
        self.assertTrue(args.args[2].endswith('.webp'))
        self.assertEqual(args.kwargs['ExtraArgs']['ContentType'], 'image/webp')
        self.assertEqual(Image.open(args.args[0]).format, 'WEBP')


class ReviewPrivacyTests(TestCase):
    def test_phone_only_author_never_exposes_phone_as_public_name(self):
        author = User.objects.create_user(phone_number='+70000000009', password='p')
        actor = Actors.objects.create(name='Тестовый', favorite_quote='Цитата', author_quote='Автор', image_url='')
        review = Review.objects.create(author=author, actor=actor, text='Отзыв')
        data = ReviewSerializer(review).data
        self.assertEqual(data['author_name'], 'Пользователь')
        self.assertNotIn(author.phone_number, str(data))


class PerformanceQueryTests(TestCase):
    def setUp(self):
        self.director = DirectorsTheatre.objects.create(name='Тестовый режиссёр', description='Текст')
        self.actor = Actors.objects.create(name='Тестовый актёр', favorite_quote='Цитата', author_quote='Автор', image_url='')
        self.client = APIClient()

    def create_performance(self, number):
        performance = Perfomances.objects.create(title=f'Спектакль {number}', author='Автор', genre='Драма', age_limit='12+', description='Текст', afisha=False, director=self.director)
        PerformanceShow.objects.create(performance=performance, show_datetime='2026-01-01T12:00:00Z')
        PerformanceCast.objects.create(performance=performance, actor=self.actor, role='Актёр')
        PerformanceCast.objects.create(performance=performance, director=self.director, role='Режиссёр')
        return performance

    def test_list_query_count_does_not_grow_with_cast_or_performances(self):
        self.create_performance(0)
        with CaptureQueriesContext(connection) as small:
            first = self.client.get('/perfomances/')
        for i in range(1, 17):
            self.create_performance(i)
        with CaptureQueriesContext(connection) as large:
            response = self.client.get('/perfomances/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 17)
        self.assertEqual(len(small), len(large))
        self.assertLessEqual(len(large), 4)
        self.assertEqual(len(response.data[0]['cast']), 2)
        self.assertEqual(response.data[0]['director_name'], self.director.name)
        self.assertEqual(len(first.data[0]['shows']), 1)


class DevelopmentDataTests(TestCase):
    def test_seed_demo_is_repeatable_and_has_no_login_or_admin_credentials(self):
        call_command('seed_demo', stdout=StringIO())
        counts = (Actors.objects.count(), Perfomances.objects.count(), Review.objects.count())
        call_command('seed_demo', stdout=StringIO())
        self.assertEqual(counts, (Actors.objects.count(), Perfomances.objects.count(), Review.objects.count()))
        demo = User.objects.get(email='demo-viewer@example.invalid')
        self.assertFalse(demo.has_usable_password())
        self.assertFalse(demo.is_superuser)

    def test_checked_in_dumps_contain_only_migration_metadata(self):
        fixture_root = os.environ.get('REPOSITORY_FIXTURE_ROOT')
        root = Path(fixture_root) if fixture_root else Path(__file__).resolve().parents[3]
        for name in ['database/init.sql', 'backend/database/init.sql']:
            table = None
            rows = 0
            for line in (root / name).read_text().splitlines():
                if line.startswith('COPY '):
                    table = line.split(' ', 2)[1]
                elif line == '\\.':
                    table = None
                elif table:
                    self.assertEqual(table, 'public.django_migrations', f'Private/application data in {name}: {table}')
                    rows += 1
            self.assertGreater(rows, 0)
