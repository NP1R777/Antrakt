from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from django.core.management import call_command
from rest_framework.test import APIClient

from .models import Perfomances, PerformanceShow, Archive


class AfishaLinksTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.performance = Perfomances.objects.create(title='Премьера', author='Автор', genre='Драма', age_limit='12+', description='Описание', afisha=True, ticket_url='https://tickets.example/general')
        self.archive = Archive.objects.create(id=self.performance.pk, title='Мероприятие', description='Описание', afisha=True, premiere_date=timezone.localdate() + timedelta(days=3))
        self.first = PerformanceShow.objects.create(performance=self.performance, show_datetime=timezone.now() + timedelta(days=2), ticket_url='https://tickets.example/first')
        self.second = PerformanceShow.objects.create(performance=self.performance, show_datetime=timezone.now() + timedelta(days=3))

    def test_standalone_detail_endpoints_preserve_show_ids_dates_and_ticket_urls(self):
        response = self.client.get(f'/perfomance{self.performance.pk}/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['afisha'])
        self.assertEqual(response.data['ticket_url'], 'https://tickets.example/general')
        self.assertEqual([(row['id'], row['ticket_url']) for row in response.data['shows']], [(self.first.pk, 'https://tickets.example/first'), (self.second.pk, None)])
        self.assertEqual(self.client.get(f'/archive{self.archive.pk}/').data['title'], 'Мероприятие')
        listing = self.client.get('/afisha/').data
        self.assertEqual({(row['type'], row['id']) for row in listing}, {('performance', self.performance.pk), ('archive', self.archive.pk)})

    def test_deleted_archive_is_not_exposed_in_schedule_or_direct_url(self):
        self.archive.deleted_at = timezone.now()
        self.archive.save(update_fields=['deleted_at'])
        self.assertEqual(self.client.get(f'/archive{self.archive.pk}/').status_code, 404)
        self.assertFalse(any(row['type'] == 'archive' for row in self.client.get('/afisha/').data))

    def test_sitemap_uses_typed_afisha_urls_and_permanent_urls_after_promotion(self):
        body = self.client.get('/sitemap.xml').content.decode()
        self.assertIn(f'/afisha/performance/{self.performance.pk}', body)
        self.assertIn(f'/afisha/archive/{self.archive.pk}', body)
        self.performance.afisha = False
        self.performance.save(update_fields=['afisha'])
        self.archive.afisha = False
        self.archive.save(update_fields=['afisha'])
        body = self.client.get('/sitemap.xml').content.decode()
        self.assertIn(f'/performance/{self.performance.pk}', body)
        self.assertIn(f'/projects/{self.archive.pk}', body)
        self.assertNotIn(f'/afisha/performance/{self.performance.pk}', body)

    def test_auto_promotion_keeps_the_record_available_and_removes_old_ticket_links(self):
        self.performance.shows.update(show_datetime=timezone.now() - timedelta(days=2))
        call_command('promote_past_performances', verbosity=0)
        response = self.client.get(f'/perfomance{self.performance.pk}/')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['afisha'])
        self.assertFalse(response.data['ticket_url'])
        self.assertTrue(all(not row['ticket_url'] for row in response.data['shows']))
