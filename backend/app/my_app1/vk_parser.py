"""Парсер отзывов из группы ВКонтакте для секции «Что говорят о нас».

Публичные страницы vk.com отдают контент стены только после авторизации
(анонимно приходит login-заглушка), поэтому надёжно получить посты и
комментарии можно через официальный VK API (метод wall.get / wall.getComments)
с access-токеном. Токен задаётся в настройках/окружении как VK_ACCESS_TOKEN.

Логика:
* Первый запуск — полный проход по всей стене; далее — только первые 20 постов.
* Среди постов ищем «приглашения оставить отзыв» по ключевым словам.
* Из комментариев к таким постам берём отзывы: имя автора, дату и текст.
* Дубли исключаются по (owner_id, post_id, comment_id).
"""
import json
import datetime
import urllib.parse
import urllib.request

from django.conf import settings
from django.utils import timezone

from .models import SiteReview, VkParserState

VK_API = 'https://api.vk.com/method/'

# Ключевые слова постов-приглашений оставить отзыв (в нижнем регистре).
REVIEW_KEYWORDS = [
    'делитесь своими впечатлениями',
    'поделитесь своими впечатлениями',
    'поделитесь впечатлениями',
    'оставить отзыв',
    'оставьте отзыв',
    'оставьте свой отзыв',
    'оставить свой отзыв',
    'оставьте отзыв о нашем спектакле',
    'ваши впечатления',
    'ваш отзыв',
    'напишите отзыв',
    'ждём ваши отзывы',
    'ждем ваши отзывы',
]

# Ограничение на глубину полного прохода (защита от бесконечной пагинации).
FULL_SCAN_CAP = 2000


class VkParserError(Exception):
    pass


def _token():
    token = getattr(settings, 'VK_ACCESS_TOKEN', '') or ''
    if not token:
        raise VkParserError(
            'VK_ACCESS_TOKEN не задан. Укажите сервисный ключ доступа ВК '
            '(Secrets / переменные окружения), чтобы парсер мог читать группу.'
        )
    return token


def _api_call(method, params):
    q = dict(params)
    q['access_token'] = _token()
    q['v'] = getattr(settings, 'VK_API_VERSION', '5.199')
    url = VK_API + method + '?' + urllib.parse.urlencode(q)
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except VkParserError:
        raise
    except Exception as exc:  # сетевые/парсинговые ошибки
        raise VkParserError(f'Ошибка запроса к ВК ({method}): {exc}')
    if 'error' in data:
        raise VkParserError(data['error'].get('error_msg', f'VK API error ({method})'))
    return data.get('response', {}) or {}


def _text_has_keyword(text):
    low = (text or '').lower()
    return any(k in low for k in REVIEW_KEYWORDS)


def _iter_review_posts(full):
    domain = getattr(settings, 'VK_GROUP_DOMAIN', 'tc_antrakt')
    posts = []
    if full:
        offset, total = 0, None
        while True:
            resp = _api_call('wall.get', {'domain': domain, 'count': 100, 'offset': offset})
            items = resp.get('items', [])
            if total is None:
                total = resp.get('count', 0)
            posts.extend(items)
            offset += len(items)
            if not items or offset >= total or offset >= FULL_SCAN_CAP:
                break
    else:
        resp = _api_call('wall.get', {'domain': domain, 'count': 20, 'offset': 0})
        posts = resp.get('items', [])
    return [p for p in posts if _text_has_keyword(p.get('text', ''))]


def _profile_map(resp):
    m = {}
    for u in resp.get('profiles', []) or []:
        m[u['id']] = {
            'name': f"{u.get('first_name', '')} {u.get('last_name', '')}".strip(),
            'photo': u.get('photo_100', ''),
        }
    for g in resp.get('groups', []) or []:
        m[-g['id']] = {'name': g.get('name', ''), 'photo': g.get('photo_100', '')}
    return m


def _get_comments(owner_id, post_id):
    return _api_call('wall.getComments', {
        'owner_id': owner_id,
        'post_id': post_id,
        'count': 100,
        'extended': 1,
        'fields': 'first_name,last_name,photo_100',
    })


def parse_reviews(full=False):
    """Основная процедура парсинга. Возвращает dict со статистикой."""
    state = VkParserState.get_solo()
    if not state.initial_done:
        full = True  # первый запуск всегда полный

    added = 0
    posts = _iter_review_posts(full)
    for post in posts:
        owner_id = post.get('owner_id')
        post_id = post.get('id')
        source_url = f'https://vk.com/wall{owner_id}_{post_id}'
        resp = _get_comments(owner_id, post_id)
        profiles = _profile_map(resp)
        for c in resp.get('items', []):
            text = (c.get('text') or '').strip()
            if not text:
                continue
            prof = profiles.get(c.get('from_id'), {})
            name = prof.get('name') or 'Зритель'
            cdate = c.get('date')
            review_date = (datetime.date.fromtimestamp(cdate) if cdate else None)
            _, created = SiteReview.objects.update_or_create(
                vk_owner_id=owner_id,
                vk_post_id=post_id,
                vk_comment_id=c.get('id'),
                defaults={
                    'author_name': name,
                    'text': text,
                    'avatar_url': prof.get('photo', ''),
                    'review_date': review_date,
                    'source_url': source_url,
                    'source': 'vk',
                    'role': 'Зритель',
                },
            )
            if created:
                added += 1

    state.initial_done = True
    state.last_run_at = timezone.now()
    state.last_result = f'Постов-приглашений: {len(posts)}, новых отзывов: {added}'
    state.save()
    return {'posts': len(posts), 'added': added, 'full': full}
