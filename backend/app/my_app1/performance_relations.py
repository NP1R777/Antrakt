import hashlib
import json
from itertools import zip_longest

from django.db import transaction, connection
from django.core.management.base import CommandError

from .models import Actors, DirectorsTheatre, Perfomances, PerformanceCast, LegacyPerformanceCredit, split_actor_roles, join_actor_roles


def legacy_entries(person):
    if isinstance(person, Actors):
        return [dict(title=title, role=role) for title, role in zip_longest(person.perfomances or [], person.role_in_perfomances or [], fillvalue=None)]
    return [dict(title=title, year=year, team=team) for title, year, team in zip_longest(person.perfomances or [], person.years or [], person.team_name or [], fillvalue=None)]


def relationship_plan(*, lock=False):
    def rows(model):
        query = model.objects.order_by('pk')
        return list(query.select_for_update() if lock else query)
    actors, directors, performances = rows(Actors), rows(DirectorsTheatre), rows(Perfomances)
    cast_query = PerformanceCast.objects.order_by('pk')
    cast = list((cast_query.select_for_update() if lock else cast_query).values())
    ledger_query = LegacyPerformanceCredit.objects.order_by('pk')
    ledger = list((ledger_query.select_for_update() if lock else ledger_query).values())
    state = {'actors': [p.__dict__ | {'_state': None} for p in actors],
             'directors': [p.__dict__ | {'_state': None} for p in directors],
             'performances': [p.__dict__ | {'_state': None} for p in performances], 'cast': cast, 'ledger': ledger}
    digest = hashlib.sha256(json.dumps(state, default=str, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    entries = []
    for kind, people in [('actor', actors), ('director', directors)]:
        for person in people:
            for index, snapshot in enumerate(legacy_entries(person)):
                title = snapshot['title']
                candidates = [p for p in performances if not p.deleted_at and not p.afisha and title and
                              (p.title == title or (kind == 'director' and p.production_title == title))]
                status = 'matched' if len(candidates) == 1 else 'ambiguous' if candidates else 'unmatched'
                perf = candidates[0] if len(candidates) == 1 else None
                if person.deleted_at:
                    status = 'owner_deleted'
                if perf and kind == 'director' and perf.director_id not in (None, person.pk):
                    status = 'director_conflict'
                previous = next((r for r in ledger if r[f'{kind}_id'] == person.pk and r['legacy_index'] == index), None)
                if previous:
                    status = 'already_linked' if previous['snapshot'] == snapshot and previous['performance_id'] == (perf.pk if perf else None) else 'snapshot_conflict'
                if kind == 'actor' and (not snapshot['role'] or any(len(r) > 100 for r in split_actor_roles(snapshot['role']))):
                    status = 'missing_or_invalid_role'
                entries.append({'kind': kind, 'owner_id': person.pk, 'index': index, 'snapshot': snapshot,
                                'performance_id': perf.pk if perf else None, 'status': status,
                                'candidate_ids': [p.pk for p in candidates]})
    for entry in entries:
        if entry['kind'] == 'director' and entry['status'] == 'matched':
            peers = [e for e in entries if e['kind'] == 'director' and e['owner_id'] == entry['owner_id'] and e['performance_id'] == entry['performance_id']]
            if any(e['snapshot'] != entry['snapshot'] for e in peers):
                entry['status'] = 'metadata_conflict'
    # Two directors must not both claim an unassigned performance in the same import.
    for entry in entries:
        if entry['kind'] == 'director' and entry['status'] == 'matched':
            owners = {e['owner_id'] for e in entries if e['kind'] == 'director' and e['performance_id'] == entry['performance_id'] and e['status'] in ('matched', 'director_conflict')}
            if len(owners) > 1:
                entry['status'] = 'director_conflict'
    return {'digest': digest, 'actor_count': len(actors), 'director_count': len(directors), 'entries': entries}


@transaction.atomic
def apply_relationship_plan(expected_digest):
    if connection.vendor != 'postgresql':
        raise CommandError('Перенос поддерживается только в PostgreSQL.')
    # Row locks cannot prevent a new duplicate title being inserted mid-import.
    # Briefly block writes to these tables; public reads can continue.
    tables = sorted(model._meta.db_table for model in (Actors, DirectorsTheatre, Perfomances, PerformanceCast, LegacyPerformanceCredit))
    with connection.cursor() as cursor:
        cursor.execute('LOCK TABLE ' + ', '.join(connection.ops.quote_name(t) for t in tables) + ' IN SHARE ROW EXCLUSIVE MODE')
    plan = relationship_plan(lock=True)
    if plan['digest'] != expected_digest:
        raise CommandError('База изменилась после отчёта. Выполните анализ заново; ничего не перенесено.')
    for entry in plan['entries']:
        if entry['status'] != 'matched':
            continue
        owner = {entry['kind'] + '_id': entry['owner_id']}
        LegacyPerformanceCredit.objects.create(**owner, legacy_index=entry['index'], snapshot=entry['snapshot'], performance_id=entry['performance_id'])
        if entry['kind'] == 'actor':
            for role in split_actor_roles(entry['snapshot']['role']):
                PerformanceCast.objects.get_or_create(performance_id=entry['performance_id'], actor_id=entry['owner_id'], role=role)
        else:
            Perfomances.objects.filter(pk=entry['performance_id'], director__isnull=True).update(director_id=entry['owner_id'])
    return plan


def performance_credits(person):
    """Read by FK, with untouched, non-clickable legacy rows as a fallback."""
    actor = isinstance(person, Actors)
    ledger = {r.legacy_index: r for r in person.legacy_credits.all()}
    results, canonical = [], {}
    if actor:
        for member in person.cast_roles.all():
            perf = member.performance
            if perf.deleted_at or perf.afisha:
                continue
            item = canonical.setdefault(perf.pk, {'performance_id': perf.pk, 'title': perf.title, 'roles': [], 'legacy': False})
            item['roles'].append(member.role)
        for item in canonical.values():
            item['role'] = join_actor_roles(item.pop('roles'))
    else:
        for perf in person.directed_performances.all():
            if perf.deleted_at or perf.afisha:
                continue
            canonical[perf.pk] = {'performance_id': perf.pk, 'title': perf.production_title or perf.title,
                                  'year': perf.production_year, 'team': perf.production_collective, 'legacy': False}
    for index, snapshot in enumerate(legacy_entries(person)):
        saved = ledger.get(index)
        if saved and saved.snapshot == snapshot and saved.performance_id in canonical:
            if not actor:
                item = canonical[saved.performance_id]
                item['year'] = item['year'] or snapshot['year']
                item['team'] = item['team'] or snapshot['team']
            continue
        # A reviewed actor role removed from an active cast is an intentional edit.
        if saved and saved.snapshot == snapshot and actor and saved.performance and not saved.performance.deleted_at and not saved.performance.afisha:
            continue
        results.append({**snapshot, 'performance_id': None, 'legacy': True})
    return list(canonical.values()) + results
