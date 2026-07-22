from datetime import timedelta, date
from importlib import import_module

from django.db import connection
from django.test import TestCase, TransactionTestCase
from django.core.management import call_command
from django.utils import timezone

from rest_framework.test import APIRequestFactory, force_authenticate, APIClient

from my_app1.models import (
    Perfomances, Actors, PerformanceShow, PerformanceCast, User,
    Review, ReviewReaction, DirectorsTheatre, Archive, News,
    Achievements, EmailVerification, promote_performance,
    promote_past_performances, refresh_afisha_hold,
)
from my_app1.serializers import ActorsSerializer, PerfomanceSerializer
from my_app1.actor_gender import actor_role_label, infer_actor_gender


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


class AchievementApiTests(TestCase):
    def test_create_without_gallery_uses_empty_list(self):
        response = APIClient().post(
            '/achievements/',
            {'achievement': 'Диплом первой степени', 'image_url': ''},
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['images_list'], [])
        self.assertEqual(
            Achievements.objects.get(pk=response.data['id']).images_list,
            [],
        )


class AchievementSchemaRepairTests(TransactionTestCase):
    def test_repair_is_idempotent_and_preserves_existing_rows(self):
        achievement = Achievements.objects.create(
            achievement='Существующее достижение',
            image_url='',
        )
        migration = import_module(
            'my_app1.migrations.0019_reconcile_achievements_images_list'
        )

        with connection.cursor() as cursor:
            cursor.execute(
                'ALTER TABLE public.achievements DROP COLUMN images_list'
            )
            cursor.execute(migration.ENSURE_ACHIEVEMENT_IMAGES_LIST_SQL)
            cursor.execute(
                """
                UPDATE public.achievements
                SET images_list = ARRAY[%s]::character varying(500)[]
                WHERE id = %s
                """,
                ['https://example.com/diploma.jpg', achievement.pk],
            )
            cursor.execute(migration.ENSURE_ACHIEVEMENT_IMAGES_LIST_SQL)
            cursor.execute(
                """
                SELECT format_type(attribute.atttypid, attribute.atttypmod),
                       attribute.attnotnull,
                       default_value.adbin IS NOT NULL
                FROM pg_attribute AS attribute
                LEFT JOIN pg_attrdef AS default_value
                  ON default_value.adrelid = attribute.attrelid
                 AND default_value.adnum = attribute.attnum
                WHERE attribute.attrelid = 'public.achievements'::regclass
                  AND attribute.attname = 'images_list'
                  AND NOT attribute.attisdropped
                """
            )
            column = cursor.fetchone()
            cursor.execute(
                'SELECT images_list FROM public.achievements WHERE id = %s',
                [achievement.pk],
            )
            images_list = cursor.fetchone()[0]

        self.assertEqual(column, ('character varying(500)[]', True, False))
        self.assertEqual(images_list, ['https://example.com/diploma.jpg'])


class ActorGenderTests(TestCase):
    def test_inference_uses_given_name_and_surname(self):
        cases = {
            'Захаров Илья': 'male',
            'Юсупова Зайнап': 'female',
            'Умблия Ольга': 'female',
            'Авдиенко Инна': 'female',
            'Протченко Татьяна': 'female',
            'Садртдинова Гузель': 'female',
            'Гузель Садртдинова': 'female',
            'Нусс Анастасия': 'female',
        }
        for name, expected in cases.items():
            with self.subTest(name=name):
                self.assertEqual(infer_actor_gender(name), expected)

    def test_admin_override_wins(self):
        self.assertEqual(actor_role_label('Захаров Илья', 'female'), 'Актриса')
        self.assertEqual(actor_role_label('Юсупова Зайнап', 'male'), 'Актёр')

    def test_serializer_exposes_role_label(self):
        actor = make_actor('Авдиенко Инна')
        data = ActorsSerializer(actor).data
        self.assertEqual(data['role_label'], 'Актриса')


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


class RegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_requires_email(self):
        resp = self.client.post('/register/', {'password': 'Teatr2026!'}, format='json')
        self.assertEqual(resp.status_code, 400)
        self.assertIn('email', resp.data)

    def test_register_sends_code_without_creating_user(self):
        resp = self.client.post('/register/', {
            'email': 'viewer@test.com',
            'password': 'Teatr2026!',
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        # Пользователь ещё НЕ создан, есть только заявка на подтверждение.
        self.assertFalse(User.objects.filter(email='viewer@test.com').exists())
        self.assertTrue(EmailVerification.objects.filter(email='viewer@test.com').exists())

    def test_verify_creates_regular_user(self):
        self.client.post('/register/', {
            'email': 'viewer@test.com', 'password': 'Teatr2026!', 'is_superuser': True,
        }, format='json')
        code = EmailVerification.objects.get(email='viewer@test.com').code
        resp = self.client.post('/register/verify/', {
            'email': 'viewer@test.com', 'code': code,
        }, format='json')
        self.assertEqual(resp.status_code, 201)
        user = User.objects.get(email='viewer@test.com')
        # Регистрация никогда не создаёт администратора.
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)
        self.assertTrue(user.check_password('Teatr2026!'))
        # Заявка удаляется после подтверждения.
        self.assertFalse(EmailVerification.objects.filter(email='viewer@test.com').exists())

    def test_verify_wrong_code_rejected(self):
        self.client.post('/register/', {'email': 'v2@test.com', 'password': 'Teatr2026!'}, format='json')
        resp = self.client.post('/register/verify/', {'email': 'v2@test.com', 'code': '000000'}, format='json')
        self.assertEqual(resp.status_code, 400)
        self.assertFalse(User.objects.filter(email='v2@test.com').exists())
        self.assertEqual(EmailVerification.objects.get(email='v2@test.com').attempts, 1)

    def test_register_duplicate_email_rejected(self):
        User.objects.create_user(password='x', email='dup@test.com', phone_number='+7-000-000-00-11')
        resp = self.client.post('/register/', {
            'email': 'dup@test.com', 'password': 'Teatr2026!',
        }, format='json')
        self.assertEqual(resp.status_code, 400)


class ReviewApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            password='Teatr2026!', email='u@test.com', phone_number='+7-000-000-00-21')
        self.admin = User.objects.create_superuser(
            password='Admin2026!', email='a@test.com', phone_number='+7-000-000-00-22')
        self.performance = Perfomances.objects.create(
            title='Спектакль', author='А', genre='Драма', age_limit='12+',
            description='о', afisha=False)

    def test_review_requires_auth(self):
        resp = self.client.post(f'/perfomance{self.performance.id}/reviews/',
                                {'text': 'аноним'}, format='json')
        self.assertIn(resp.status_code, (401, 403))

    def test_create_and_list_review(self):
        self.client.force_authenticate(self.user)
        resp = self.client.post(f'/perfomance{self.performance.id}/reviews/',
                                {'text': 'Отлично!'}, format='json')
        self.assertEqual(resp.status_code, 201)
        # Список публичный, но email автора скрыт от анонима.
        self.client.force_authenticate(None)
        listing = self.client.get(f'/perfomance{self.performance.id}/reviews/')
        self.assertEqual(len(listing.data), 1)
        self.assertIsNone(listing.data[0]['author_email'])

    def test_reaction_limit_three(self):
        review = Review.objects.create(author=self.user, performance=self.performance, text='t')
        self.client.force_authenticate(self.user)
        for r in ['heart', 'like', 'laugh']:
            resp = self.client.post(f'/review{review.id}/react/', {'reaction': r}, format='json')
            self.assertEqual(resp.status_code, 200)
        resp = self.client.post(f'/review{review.id}/react/', {'reaction': 'wow'}, format='json')
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(ReviewReaction.objects.filter(review=review, user=self.user).count(), 3)

    def test_reaction_toggle_off(self):
        review = Review.objects.create(author=self.user, performance=self.performance, text='t')
        self.client.force_authenticate(self.user)
        self.client.post(f'/review{review.id}/react/', {'reaction': 'heart'}, format='json')
        self.assertEqual(ReviewReaction.objects.count(), 1)
        self.client.post(f'/review{review.id}/react/', {'reaction': 'heart'}, format='json')
        self.assertEqual(ReviewReaction.objects.count(), 0)

    def test_only_author_or_admin_deletes(self):
        other = User.objects.create_user(password='x', email='o@test.com', phone_number='+7-000-000-00-23')
        review = Review.objects.create(author=self.user, performance=self.performance, text='t')
        self.client.force_authenticate(other)
        resp = self.client.delete(f'/review{review.id}/')
        self.assertEqual(resp.status_code, 403)
        self.client.force_authenticate(self.admin)
        resp = self.client.delete(f'/review{review.id}/')
        self.assertEqual(resp.status_code, 204)

    def test_change_password_verifies_current(self):
        self.client.force_authenticate(self.user)
        bad = self.client.post('/change-password/',
                               {'current_password': 'wrong', 'new_password': 'NewPass2026!'},
                               format='json')
        self.assertEqual(bad.status_code, 400)
        ok = self.client.post('/change-password/',
                              {'current_password': 'Teatr2026!', 'new_password': 'NewPass2026!'},
                              format='json')
        self.assertEqual(ok.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPass2026!'))

    def test_user_list_requires_admin(self):
        resp = self.client.get('/users/')
        self.assertIn(resp.status_code, (401, 403))
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get('/users/').status_code, 200)


class ActorTenureTests(TestCase):
    def test_years_in_theatre_computed_from_joined_at(self):
        today = timezone.localdate()
        actor = make_actor()
        actor.joined_at = date(today.year - 3, today.month, 1)
        actor.save()
        self.assertEqual(actor.years_in_theatre, 3)
        self.assertTrue(actor.is_active)

    def test_departed_actor_counter_frozen(self):
        today = timezone.localdate()
        actor = make_actor()
        actor.joined_at = date(today.year - 10, 1, 1)
        actor.left_at = date(today.year - 5, 1, 1)  # ушёл, пробыв 5 лет
        actor.save()
        self.assertFalse(actor.is_active)
        self.assertEqual(actor.years_in_theatre, 5)

    def test_serializer_exposes_computed_fields(self):
        from my_app1.serializers import ActorsSerializer
        today = timezone.localdate()
        actor = make_actor()
        actor.joined_at = date(today.year - 2, today.month, 1)
        actor.save()
        data = ActorsSerializer(actor).data
        self.assertEqual(data['time_in_theatre'], '2')
        self.assertTrue(data['is_active'])


class ExtendedReviewTargetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            password='Teatr2026!', email='ru@test.com', phone_number='+7-000-000-00-31')
        self.director = DirectorsTheatre.objects.create(name='Реж', description='о')
        self.news = News.objects.create(title='Новость', description='о')
        self.archive_past = Archive.objects.create(title='Прошлое', description='о', afisha=False)
        self.archive_afisha = Archive.objects.create(title='Афиша', description='о', afisha=True)

    def test_director_review(self):
        self.client.force_authenticate(self.user)
        resp = self.client.post(f'/director{self.director.id}/reviews/', {'text': 'ок'}, format='json')
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data['subject_type'], 'director')

    def test_news_review(self):
        self.client.force_authenticate(self.user)
        resp = self.client.post(f'/news{self.news.id}/reviews/', {'text': 'ок'}, format='json')
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data['subject_type'], 'news')

    def test_archive_review_allowed_for_past(self):
        self.client.force_authenticate(self.user)
        resp = self.client.post(f'/archive{self.archive_past.id}/reviews/', {'text': 'ок'}, format='json')
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data['subject_type'], 'archive')

    def test_archive_review_blocked_for_afisha(self):
        self.client.force_authenticate(self.user)
        resp = self.client.post(f'/archive{self.archive_afisha.id}/reviews/', {'text': 'ок'}, format='json')
        self.assertEqual(resp.status_code, 400)


class AdminEndpointPermissionTests(TestCase):
    """Админские эндпоинты открыты суперпользователю (даже если is_staff=False),
    и закрыты для обычных пользователей."""

    def setUp(self):
        self.client = APIClient()

    def test_staffless_superuser_has_admin_access(self):
        su = User.objects.create(
            email='su@test.com', phone_number='+7-000-000-77-77',
            profile_photo='', is_superuser=True, is_staff=False)
        su.set_password('short')  # короткий пароль (как у старых аккаунтов)
        su.save()
        self.client.force_authenticate(su)
        self.assertEqual(self.client.get('/users/').status_code, 200)
        self.assertEqual(self.client.get('/reviews-admin/').status_code, 200)

    def test_regular_user_denied_admin_access(self):
        u = User.objects.create_user(
            password='plainpass1', email='ru2@test.com', phone_number='+7-000-000-66-66')
        self.client.force_authenticate(u)
        self.assertEqual(self.client.get('/users/').status_code, 403)
        self.assertEqual(self.client.get('/reviews-admin/').status_code, 403)


class DirectorPromotionTests(TestCase):
    def setUp(self):
        self.now = timezone.now()
        self.director = DirectorsTheatre.objects.create(name='Режиссёр', description='о')
        self.factory = APIRequestFactory()
        self.client = APIClient()

    def _perf(self, afisha=True):
        return Perfomances.objects.create(
            title='Спектакль реж', author='А', genre='Драма', age_limit='12+',
            description='о', afisha=afisha, director=self.director,
            premiere_date=date(self.now.year - 1, 5, 1))

    def test_director_gets_performance_on_promotion(self):
        perf = self._perf(afisha=True)
        PerformanceShow.objects.create(performance=perf, show_datetime=self.now - timedelta(days=1))
        promote_performance(perf)
        promote_performance(perf)  # идемпотентность
        self.director.refresh_from_db()
        self.assertIn(perf.title, self.director.perfomances)
        self.assertEqual(self.director.perfomances.count(perf.title), 1)
        # Параллельные массивы остаются согласованными по длине.
        self.assertEqual(len(self.director.perfomances), len(self.director.years))
        self.assertEqual(len(self.director.perfomances), len(self.director.team_name))

    def test_default_collective_when_not_specified(self):
        perf = self._perf(afisha=True)
        PerformanceShow.objects.create(performance=perf, show_datetime=self.now - timedelta(days=1))
        promote_performance(perf)
        self.director.refresh_from_db()
        idx = self.director.perfomances.index(perf.title)
        # Коллектив по умолчанию — труппа Норильского театра.
        self.assertEqual(self.director.team_name[idx], Perfomances.DEFAULT_COLLECTIVE)
        # Год по умолчанию — из премьеры.
        self.assertEqual(self.director.years[idx], perf.premiere_date.year)

    def test_director_catch_up_after_promotion(self):
        # Спектакль переведён в "Спектакли" БЕЗ режиссёра, режиссёра назначили позже.
        perf = self._perf(afisha=True)
        perf.director = None
        perf.save()
        PerformanceShow.objects.create(performance=perf, show_datetime=self.now - timedelta(days=1))
        promote_performance(perf)
        perf.refresh_from_db()
        self.assertFalse(perf.afisha)
        self.assertTrue(perf.roles_propagated)
        self.assertFalse(perf.director_propagated)
        # Назначаем режиссёра и повторно промоутим (как повторное сохранение в админке).
        perf.director = self.director
        perf.save()
        promote_performance(perf)
        self.director.refresh_from_db()
        perf.refresh_from_db()
        self.assertTrue(perf.director_propagated)
        self.assertIn(perf.title, self.director.perfomances)

    def test_custom_production_fields_used(self):
        perf = self._perf(afisha=True)
        perf.production_title = 'Гроза (особое название)'
        perf.production_collective = Perfomances.COLLECTIVE_DA
        perf.production_year = 2019
        perf.save()
        PerformanceShow.objects.create(performance=perf, show_datetime=self.now - timedelta(days=1))
        promote_performance(perf)
        self.director.refresh_from_db()
        self.assertIn('Гроза (особое название)', self.director.perfomances)
        idx = self.director.perfomances.index('Гроза (особое название)')
        self.assertEqual(self.director.team_name[idx], Perfomances.COLLECTIVE_DA)
        self.assertEqual(self.director.years[idx], 2019)
        # Название спектакля (title) не попадает, т.к. задано production_title.
        self.assertNotIn(perf.title, self.director.perfomances)

    def test_editing_collective_updates_director_page(self):
        from my_app1.models import sync_director_performance_entry

        perf = self._perf(afisha=True)
        perf.production_title = 'Лазарет'
        perf.production_collective = Perfomances.DEFAULT_COLLECTIVE
        perf.production_year = 2025
        perf.save()
        PerformanceShow.objects.create(
            performance=perf, show_datetime=self.now - timedelta(days=1)
        )
        perf = promote_performance(perf)
        self.director.refresh_from_db()
        idx = self.director.perfomances.index('Лазарет')
        self.assertEqual(self.director.team_name[idx], Perfomances.DEFAULT_COLLECTIVE)

        # Как при сохранении формы спектакля в админке: меняем коллектив.
        new_collective = (
            'Труппа норильского народного театра/'
            'Образцовый коллектив - театральная студия «ДА»'
        )
        perf.production_collective = new_collective
        perf.save(update_fields=['production_collective'])
        perf.refresh_from_db()
        sync_director_performance_entry(perf, previous_title='Лазарет')

        self.director.refresh_from_db()
        idx = self.director.perfomances.index('Лазарет')
        self.assertEqual(self.director.team_name[idx], new_collective)

    def test_deleting_performance_removes_it_from_director(self):
        perf = self._perf(afisha=True)
        perf.production_title = 'Удаляемая постановка'
        perf.production_collective = Perfomances.COLLECTIVE_DA
        perf.production_year = 2024
        perf.save()
        PerformanceShow.objects.create(
            performance=perf,
            show_datetime=self.now - timedelta(days=1),
        )
        promote_performance(perf)
        self.director.refresh_from_db()
        self.assertIn(perf.production_title, self.director.perfomances)

        response = self.client.delete(f'/perfomance{perf.id}/?hard=1')

        self.assertEqual(response.status_code, 204)
        self.director.refresh_from_db()
        self.assertNotIn(perf.production_title, self.director.perfomances)
        self.assertEqual(
            len(self.director.perfomances),
            len(self.director.years),
        )
        self.assertEqual(
            len(self.director.perfomances),
            len(self.director.team_name),
        )

    def test_director_name_visible_in_afisha_but_cast_hidden(self):
        from my_app1.serializers import PerfomanceSerializer
        actor = Actors.objects.create(name='А', favorite_quote='ц', author_quote='а', image_url='')
        perf = self._perf(afisha=True)
        PerformanceCast.objects.create(performance=perf, actor=actor, role='Роль')
        request = self.factory.get('/')  # аноним
        data = PerfomanceSerializer(perf, context={'request': request}).data
        self.assertEqual(data['director_name'], 'Режиссёр')  # имя видно
        self.assertEqual(data['cast'], [])  # состав скрыт


class SoftHardDeleteTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(password='p', email='d@test.com', phone_number='+7-000-000-55-01')
        self.perf = Perfomances.objects.create(
            title='Спектакль', author='А', genre='Драма', age_limit='12+', description='о', afisha=False)
        self.review = Review.objects.create(author=self.user, performance=self.perf, text='t')

    def test_review_soft_delete_hides_but_keeps(self):
        self.client.force_authenticate(self.user)
        resp = self.client.delete(f'/review{self.review.id}/')
        self.assertEqual(resp.status_code, 204)
        self.review.refresh_from_db()
        self.assertIsNotNone(self.review.deleted_at)  # запись осталась
        listing = self.client.get(f'/perfomance{self.perf.id}/reviews/')
        self.assertEqual(len(listing.data), 0)  # скрыта из публичного списка

    def test_review_hard_delete_removes(self):
        self.client.force_authenticate(self.user)
        resp = self.client.delete(f'/review{self.review.id}/?hard=1')
        self.assertEqual(resp.status_code, 204)
        self.assertFalse(Review.objects.filter(id=self.review.id).exists())

    def test_actor_soft_then_hard(self):
        actor = make_actor('Удаляемый')
        self.client.delete(f'/actor{actor.id}/')  # мягко
        actor.refresh_from_db()
        self.assertIsNotNone(actor.deleted_at)
        self.assertTrue(Actors.objects.filter(id=actor.id).exists())
        self.client.delete(f'/actor{actor.id}/?hard=1')  # жёстко
        self.assertFalse(Actors.objects.filter(id=actor.id).exists())

    def test_purge_command_removes_old_soft_deleted(self):
        old = make_actor('Старый')
        old.deleted_at = timezone.now() - timedelta(days=61)
        old.save()
        recent = make_actor('Недавний')
        recent.deleted_at = timezone.now() - timedelta(days=10)
        recent.save()
        call_command('purge_soft_deleted')
        self.assertFalse(Actors.objects.filter(id=old.id).exists())
        self.assertTrue(Actors.objects.filter(id=recent.id).exists())


class ActorActiveFilterTests(TestCase):
    def test_active_filter_excludes_departed(self):
        client = APIClient()
        active = make_actor('Действующий')
        departed = make_actor('Выбывший')
        departed.left_at = date(2025, 1, 1)
        departed.save()
        ids_all = {a['id'] for a in client.get('/actors/').data}
        ids_active = {a['id'] for a in client.get('/actors/?active=1').data}
        self.assertIn(departed.id, ids_all)
        self.assertNotIn(departed.id, ids_active)
        self.assertIn(active.id, ids_active)


class NameDeclensionTests(TestCase):
    def test_male_accusative_and_genitive(self):
        from my_app1.name_declension import format_greeting, decline_full_name
        from pytrovich.enums import Case

        self.assertEqual(
            decline_full_name('Илья Захаров', Case.ACCUSATIVE),
            'Илью Захарова',
        )
        self.assertEqual(
            decline_full_name('Захаров Илья', Case.ACCUSATIVE),
            'Захарова Илью',
        )
        greeting = format_greeting(
            'Поздравляем с днём рождения {name}',
            'Илья Захаров',
        )
        self.assertIn('Илью Захарова', greeting)

    def test_female_placeholders(self):
        from my_app1.name_declension import format_greeting

        text = format_greeting(
            'Сегодня день рождения у {name_gen}! Поздравляем {name_acc}!',
            'Елена Курченкова',
            'female',
        )
        self.assertIn('Елены Курченковой', text)
        self.assertIn('Елену Курченкову', text)


class MultiRoleCastSyncTests(TestCase):
    def test_two_roles_same_performance_one_badge(self):
        from my_app1.models import sync_performance_cast_to_actors

        actor = make_actor('Тестов Тест')
        perf = make_performance(title='Дюймовочка', afisha=False)
        PerformanceCast.objects.create(performance=perf, actor=actor, role='Жаб-сын Гисли')
        PerformanceCast.objects.create(
            performance=perf, actor=actor, role='Майский жук Ингемар'
        )

        sync_performance_cast_to_actors(perf)
        actor.refresh_from_db()

        self.assertEqual(actor.perfomances.count(perf.title), 1)
        idx = actor.perfomances.index(perf.title)
        role = actor.role_in_perfomances[idx]
        self.assertIn('Жаб-сын Гисли', role)
        self.assertIn('Майский жук Ингемар', role)
        self.assertIn(' / ', role)

        data = ActorsSerializer(actor).data
        self.assertEqual(data['perfomances'].count(perf.title), 1)


class ReturnToAfishaTests(TestCase):
    def setUp(self):
        self.now = timezone.now()
        self.client = APIClient()
        self.admin = User.objects.create(
            email='afisha-admin@test.com', is_superuser=True, is_staff=True,
            phone_number='+7-000-000-00-99', profile_photo='',
        )
        self.admin.set_password('Teatr2026!')
        self.admin.save()
        self.client.force_authenticate(user=self.admin)

    def test_manual_return_to_afisha_stays_despite_past_shows(self):
        actor = make_actor()
        perf = make_performance(afisha=False, title='Возврат в афишу')
        PerformanceShow.objects.create(
            performance=perf, show_datetime=self.now - timedelta(days=3)
        )
        PerformanceCast.objects.create(performance=perf, actor=actor, role='Роль')
        promote_performance(perf)
        actor.refresh_from_db()
        self.assertIn(perf.title, actor.perfomances)

        resp = self.client.put(
            f'/perfomance{perf.id}/',
            {
                'title': perf.title,
                'author': perf.author,
                'genre': perf.genre,
                'age_limit': perf.age_limit,
                'description': perf.description,
                'afisha': True,
                'shows': [{
                    'show_datetime': (self.now - timedelta(days=3)).isoformat(),
                }],
                'cast': [{
                    'actor': actor.id,
                    'role': 'Роль',
                    'actor_name': actor.name,
                }],
            },
            format='json',
        )
        self.assertEqual(resp.status_code, 200, resp.data)
        perf.refresh_from_db()
        self.assertTrue(perf.afisha)
        self.assertTrue(perf.afisha_hold)
        self.assertFalse(perf.roles_propagated)

        # Авто-промоут не должен сразу выкинуть спектакль обратно.
        promote_past_performances()
        perf.refresh_from_db()
        self.assertTrue(perf.afisha)

        actor.refresh_from_db()
        self.assertNotIn(perf.title, actor.perfomances or [])

    def test_future_show_clears_hold_and_allows_promote(self):
        perf = make_performance(afisha=True, title='С будущим показом')
        PerformanceShow.objects.create(
            performance=perf, show_datetime=self.now - timedelta(days=1)
        )
        refresh_afisha_hold(perf)
        perf.refresh_from_db()
        self.assertTrue(perf.afisha_hold)

        PerformanceShow.objects.create(
            performance=perf, show_datetime=self.now + timedelta(days=2)
        )
        refresh_afisha_hold(perf)
        perf.refresh_from_db()
        self.assertFalse(perf.afisha_hold)

        # Пока есть будущий показ — не продвигаем.
        promote_past_performances()
        perf.refresh_from_db()
        self.assertTrue(perf.afisha)


class BlankOptionalFieldsCreateTests(TestCase):
    """Пустые строки в опциональных полях не должны ломать create."""

    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create(
            email='blank-admin@test.com', is_superuser=True, is_staff=True,
            phone_number='+7-111-111-11-11', profile_photo='',
        )
        self.client.force_authenticate(user=self.admin)

    def test_news_create_with_empty_date_publish(self):
        resp = self.client.post('/news/', {
            'title': 'Новость без даты',
            'description': 'Описание новости достаточно длинное',
            'date_publish': '',
            'is_published': False,
            'images_list': [],
            'image_url': '',
        }, format='json')
        self.assertEqual(resp.status_code, 201, resp.data)
        self.assertIsNone(resp.data.get('date_publish'))

    def test_users_create_with_empty_phone_twice(self):
        r1 = self.client.post('/users/', {
            'email': 'u1@test.com',
            'password': 'Teatr2026!',
            'phone_number': '',
            'is_superuser': False,
            'profile_photo': '',
        }, format='json')
        self.assertEqual(r1.status_code, 201, r1.data)
        r2 = self.client.post('/users/', {
            'email': 'u2@test.com',
            'password': 'Teatr2026!',
            'phone_number': '',
            'is_superuser': False,
            'profile_photo': '',
        }, format='json')
        self.assertEqual(r2.status_code, 201, r2.data)
        self.assertIsNone(User.objects.get(email='u1@test.com').phone_number)
        self.assertIsNone(User.objects.get(email='u2@test.com').phone_number)
