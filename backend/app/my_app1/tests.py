from datetime import timedelta

from django.test import TestCase
from django.core.management import call_command
from django.utils import timezone

from rest_framework.test import APIRequestFactory, force_authenticate

from my_app1.models import (
    Perfomances, Actors, PerformanceShow, PerformanceCast, User,
    promote_performance,
)
from my_app1.serializers import PerfomanceSerializer


def make_actor(name='Актёр Тестовый'):
    return Actors.objects.create(
        name=name,
        favorite_quote='Цитата',
        author_quote='Автор',
        image_url='',
    )


def make_performance(title='Спектакль', afisha=True, description='Описание'):
    return Perfomances.objects.create(
        title=title,
        author='Автор',
        genre='Драма',
        age_limit='12+',
        description=description,
        afisha=afisha,
    )


class PromotePerformanceTests(TestCase):
    def setUp(self):
        self.now = timezone.now()

    def test_promote_moves_to_performances_and_adds_roles(self):
        actor = make_actor()
        perf = make_performance(afisha=True)
        PerformanceShow.objects.create(
            performance=perf, show_datetime=self.now - timedelta(days=1)
        )
        PerformanceCast.objects.create(performance=perf, actor=actor, role='Гамлет')

        promote_performance(perf)

        perf.refresh_from_db()
        actor.refresh_from_db()
        self.assertFalse(perf.afisha)
        self.assertTrue(perf.roles_propagated)
        self.assertIn(perf.title, actor.perfomances)
        idx = actor.perfomances.index(perf.title)
        self.assertEqual(actor.role_in_perfomances[idx], 'Гамлет')

    def test_promote_is_idempotent(self):
        actor = make_actor()
        perf = make_performance(afisha=True)
        PerformanceShow.objects.create(
            performance=perf, show_datetime=self.now - timedelta(days=1)
        )
        PerformanceCast.objects.create(performance=perf, actor=actor, role='Гамлет')

        promote_performance(perf)
        promote_performance(perf)
        promote_performance(perf)

        actor.refresh_from_db()
        self.assertEqual(actor.perfomances.count(perf.title), 1)
        self.assertEqual(actor.role_in_perfomances.count('Гамлет'), 1)

    def test_promote_preserves_manual_roles(self):
        actor = make_actor()
        actor.perfomances = ['Ручной спектакль']
        actor.role_in_perfomances = ['Ручная роль']
        actor.save()

        perf = make_performance(afisha=True)
        PerformanceShow.objects.create(
            performance=perf, show_datetime=self.now - timedelta(days=1)
        )
        PerformanceCast.objects.create(performance=perf, actor=actor, role='Новая роль')

        promote_performance(perf)

        actor.refresh_from_db()
        self.assertEqual(actor.perfomances, ['Ручной спектакль', perf.title])
        self.assertEqual(actor.role_in_perfomances, ['Ручная роль', 'Новая роль'])


class PromoteCommandTests(TestCase):
    def setUp(self):
        self.now = timezone.now()

    def test_command_promotes_only_fully_past_performances(self):
        actor = make_actor()

        past = make_performance(title='Прошедший', afisha=True)
        PerformanceShow.objects.create(
            performance=past, show_datetime=self.now - timedelta(days=2)
        )
        PerformanceCast.objects.create(performance=past, actor=actor, role='Роль1')

        # Есть будущий показ -> остаётся в "Афише".
        upcoming = make_performance(title='С будущим показом', afisha=True)
        PerformanceShow.objects.create(
            performance=upcoming, show_datetime=self.now - timedelta(days=2)
        )
        PerformanceShow.objects.create(
            performance=upcoming, show_datetime=self.now + timedelta(days=3)
        )

        # Без показов -> команда его не трогает.
        no_shows = make_performance(title='Без показов', afisha=True)

        call_command('promote_past_performances')

        past.refresh_from_db()
        upcoming.refresh_from_db()
        no_shows.refresh_from_db()
        self.assertFalse(past.afisha)
        self.assertTrue(upcoming.afisha)
        self.assertTrue(no_shows.afisha)


class CastVisibilityTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.actor = make_actor()
        self.admin = User.objects.create(
            email='admin@test.com', is_superuser=True, is_staff=True,
            phone_number='+7-000-000-00-01', profile_photo='',
        )

    def _serialize(self, perf, authenticated=False):
        request = self.factory.get('/')
        if authenticated:
            force_authenticate(request, user=self.admin)
            request.user = self.admin
        return PerfomanceSerializer(perf, context={'request': request}).data

    def test_cast_hidden_in_afisha_for_public(self):
        perf = make_performance(afisha=True)
        PerformanceCast.objects.create(performance=perf, actor=self.actor, role='Роль')
        data = self._serialize(perf, authenticated=False)
        self.assertEqual(data['cast'], [])

    def test_cast_visible_for_admin_even_in_afisha(self):
        perf = make_performance(afisha=True)
        PerformanceCast.objects.create(performance=perf, actor=self.actor, role='Роль')
        data = self._serialize(perf, authenticated=True)
        self.assertEqual(len(data['cast']), 1)
        self.assertEqual(data['cast'][0]['role'], 'Роль')

    def test_cast_visible_in_performances_section(self):
        perf = make_performance(afisha=False)
        PerformanceCast.objects.create(performance=perf, actor=self.actor, role='Роль')
        data = self._serialize(perf, authenticated=False)
        self.assertEqual(len(data['cast']), 1)
