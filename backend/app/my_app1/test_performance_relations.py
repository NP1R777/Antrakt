from io import StringIO
from unittest.mock import patch

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Actors, DirectorsTheatre, Perfomances, PerformanceCast, LegacyPerformanceCredit, User, sync_performance_cast_to_actors
from .performance_relations import relationship_plan, apply_relationship_plan, performance_credits


class SafeRelationshipImportTests(TestCase):
    def setUp(self):
        self.actor = Actors.objects.create(name='Тестовый актёр', favorite_quote='Сохранить цитату', author_quote='Автор', image_url='https://example.invalid/photo.png',
                                          perfomances=['Спектакль', 'Неизвестный'], role_in_perfomances=['Первая / Вторая', 'Историческая роль'])
        self.director = DirectorsTheatre.objects.create(name='Тестовый режиссёр', description='Сохранить биографию', perfomances=['Постановка'], years=[2020], team_name=['Коллектив'])
        self.perf = Perfomances.objects.create(title='Спектакль', production_title='Постановка', production_year=2020, production_collective='Коллектив', author='Автор', genre='Драма', description='Текст', age_limit='12+', afisha=False)

    def apply(self):
        return apply_relationship_plan(relationship_plan()['digest'])

    def person_state(self):
        return list(Actors.objects.order_by('pk').values()), list(DirectorsTheatre.objects.order_by('pk').values())

    def test_analysis_does_not_write_and_is_deterministic(self):
        before = self.person_state()
        first = relationship_plan()
        call_command('link_legacy_performances', stdout=StringIO())
        self.assertEqual(first['digest'], relationship_plan()['digest'])
        self.assertEqual(before, self.person_state())
        self.assertEqual(LegacyPerformanceCredit.objects.count(), 0)
        self.assertEqual(PerformanceCast.objects.count(), 0)

    def test_apply_preserves_every_person_field_and_adds_missing_roles_only(self):
        before = self.person_state()
        PerformanceCast.objects.create(performance=self.perf, actor=self.actor, role='Существующая роль')
        self.apply()
        self.assertEqual(before, self.person_state())
        self.assertEqual(set(self.perf.cast_members.values_list('role', flat=True)), {'Существующая роль', 'Первая', 'Вторая'})
        self.perf.refresh_from_db()
        self.assertEqual(self.perf.director_id, self.director.pk)
        count = LegacyPerformanceCredit.objects.count()
        self.apply()
        self.assertEqual(LegacyPerformanceCredit.objects.count(), count)
        self.assertEqual(self.perf.cast_members.count(), 3)

    def test_duplicate_titles_and_missing_titles_never_pick_first_match(self):
        Perfomances.objects.create(title='Спектакль', author='Другой автор', genre='Драма', description='Текст', age_limit='12+', afisha=False)
        plan = self.apply()
        actor_entries = [e for e in plan['entries'] if e['kind'] == 'actor']
        self.assertEqual([e['status'] for e in actor_entries], ['ambiguous', 'unmatched'])
        self.assertEqual(PerformanceCast.objects.count(), 0)
        self.actor.refresh_from_db()
        self.assertEqual(self.actor.role_in_perfomances, ['Первая / Вторая', 'Историческая роль'])

    def test_changes_since_analysis_abort_without_partial_import(self):
        digest = relationship_plan()['digest']
        self.actor.favorite_quote = 'Биография изменена после отчёта'
        self.actor.save(update_fields=['favorite_quote'])
        with self.assertRaises(CommandError):
            apply_relationship_plan(digest)
        self.assertEqual(LegacyPerformanceCredit.objects.count(), 0)
        self.assertEqual(PerformanceCast.objects.count(), 0)

    def test_apply_requires_explicit_review_digest(self):
        with self.assertRaises(CommandError):
            call_command('link_legacy_performances', apply=True, stdout=StringIO())
        self.assertEqual(LegacyPerformanceCredit.objects.count(), 0)

    @patch('my_app1.performance_relations.PerformanceCast.objects.get_or_create', side_effect=RuntimeError('Import interrupted'))
    def test_failure_rolls_back_all_additions(self, create):
        before = self.person_state()
        with self.assertRaises(RuntimeError):
            self.apply()
        self.assertEqual(before, self.person_state())
        self.assertEqual(LegacyPerformanceCredit.objects.count(), 0)

    def test_conflicting_director_is_not_reassigned(self):
        other = DirectorsTheatre.objects.create(name='Другой', description='Текст')
        self.perf.director = other
        self.perf.save(update_fields=['director'])
        plan = self.apply()
        self.assertIn('director_conflict', [e['status'] for e in plan['entries']])
        self.perf.refresh_from_db()
        self.assertEqual(self.perf.director_id, other.pk)

    def test_two_directors_cannot_claim_the_same_unassigned_performance(self):
        DirectorsTheatre.objects.create(name='Второй режиссёр', description='Текст', perfomances=['Постановка'], years=[2020], team_name=['Коллектив'])
        plan = self.apply()
        self.assertEqual([e['status'] for e in plan['entries'] if e['kind'] == 'director'], ['director_conflict', 'director_conflict'])
        self.perf.refresh_from_db()
        self.assertIsNone(self.perf.director_id)

    @patch('my_app1.management.commands.link_legacy_performances.os.open', side_effect=OSError('Report unavailable'))
    def test_report_write_failure_rolls_back_successful_import(self, open_file):
        with self.assertRaises(OSError):
            call_command('link_legacy_performances', apply=True, expected_digest=relationship_plan()['digest'], report='/tmp/antrakt-new-test-report-not-written.json', stdout=StringIO())
        self.assertEqual(LegacyPerformanceCredit.objects.count(), 0)
        self.assertEqual(PerformanceCast.objects.count(), 0)

    def test_unpaired_legacy_role_is_kept_in_fallback(self):
        self.actor.role_in_perfomances.append('Роль без названия')
        self.actor.save(update_fields=['role_in_perfomances'])
        self.apply()
        credits = performance_credits(self.actor)
        self.assertTrue(any(c.get('role') == 'Роль без названия' and c['performance_id'] is None for c in credits))

    @override_settings(PERFORMANCE_RELATIONS_ENABLED=True)
    def test_rename_uses_stable_ids_and_does_not_rewrite_legacy_or_biography(self):
        self.apply()
        before = self.person_state()
        self.perf.title = 'Новое название'
        self.perf.production_title = 'Новая постановка'
        self.perf.save(update_fields=['title', 'production_title'])
        sync_performance_cast_to_actors(self.perf)
        self.assertEqual(before, self.person_state())
        actor_credits = performance_credits(self.actor)
        linked = next(c for c in actor_credits if c['performance_id'] == self.perf.pk)
        self.assertEqual(linked['title'], 'Новое название')
        self.assertEqual(linked['role'], 'Первая / Вторая')
        self.assertTrue(any(c['title'] == 'Неизвестный' and c['performance_id'] is None for c in actor_credits))
        self.assertEqual(performance_credits(self.director)[0]['title'], 'Новая постановка')

    @override_settings(PERFORMANCE_RELATIONS_ENABLED=True)
    def test_profile_edits_preserve_arrays_but_title_based_role_edits_are_rejected(self):
        self.apply()
        before_titles = list(self.actor.perfomances)
        client = APIClient()
        client.force_authenticate(User.objects.create_superuser(email='relations@example.invalid', password='p'))
        response = client.put(f'/actor{self.actor.pk}/', {'favorite_quote': 'Новая цитата'}, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        self.assertIn('performance_credits', response.data)
        response = client.put(f'/actor{self.actor.pk}/', {'perfomances': []}, format='json')
        self.assertEqual(response.status_code, 400)
        self.actor.refresh_from_db()
        self.assertEqual(self.actor.perfomances, before_titles)
        self.assertEqual(self.perf.cast_members.count(), 2)

    def test_deleting_performance_preserves_original_credits_as_unlinked_history(self):
        self.apply()
        before = self.person_state()
        self.perf.delete()
        self.assertEqual(before, self.person_state())
        self.assertTrue(all(r.performance_id is None for r in LegacyPerformanceCredit.objects.all()))
        self.assertTrue(any(c['title'] == 'Спектакль' and c['role'] == 'Первая / Вторая' for c in performance_credits(self.actor)))

    def test_legacy_full_profile_save_does_not_resync_unchanged_roles(self):
        from .serializers import ActorsSerializer
        cast = PerformanceCast.objects.create(performance=self.perf, actor=self.actor, role='Существующая роль')
        serializer = ActorsSerializer(self.actor, data={'favorite_quote': 'Новая цитата', 'perfomances': self.actor.perfomances, 'role_in_perfomances': self.actor.role_in_perfomances}, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        self.assertTrue(PerformanceCast.objects.filter(pk=cast.pk).exists())

    def test_legacy_ambiguous_edit_rolls_back_actor_and_cast_changes(self):
        from .serializers import ActorsSerializer
        from rest_framework.exceptions import ValidationError
        Perfomances.objects.create(title='Спектакль', author='Другой', genre='Драма', description='Текст', age_limit='12+', afisha=False)
        before = self.person_state()
        serializer = ActorsSerializer(self.actor, data={'perfomances': ['Спектакль'], 'role_in_perfomances': ['Изменённая роль']}, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        with self.assertRaises(ValidationError):
            serializer.save()
        self.assertEqual(before, self.person_state())
        self.assertEqual(PerformanceCast.objects.count(), 0)

    def test_legacy_historical_role_edit_preserves_future_cast(self):
        from .serializers import ActorsSerializer
        upcoming = Perfomances.objects.create(title='Будущая премьера', author='Автор', genre='Драма', description='Текст', age_limit='12+', afisha=True)
        future_role = PerformanceCast.objects.create(performance=upcoming, actor=self.actor, role='Будущая роль')
        serializer = ActorsSerializer(self.actor, data={'perfomances': ['Спектакль'], 'role_in_perfomances': ['Уточнённая роль']}, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        self.assertTrue(PerformanceCast.objects.filter(pk=future_role.pk, role='Будущая роль').exists())

    def test_legacy_mismatched_arrays_are_rejected_before_coalescing_can_drop_roles(self):
        from .serializers import ActorsSerializer
        before = self.person_state()
        serializer = ActorsSerializer(self.actor, data={'perfomances': ['Спектакль'], 'role_in_perfomances': ['Первая', 'Роль без названия']}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(before, self.person_state())
