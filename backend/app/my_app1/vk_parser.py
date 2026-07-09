"""Парсер отзывов из группы ВКонтакте для секции «Что говорят о нас».

Поддерживаются два способа получения данных (выбирается автоматически):

1. HTML-парсинг мобильной версии m.vk.com — если задан VK_SESSION_COOKIE
   (значение cookie `remixsid` из браузера, где вы вошли во ВКонтакте).
   Не требует прав администратора группы и токена приложения.
2. Официальный VK API (wall.get / wall.getComments) — если задан
   VK_ACCESS_TOKEN (сервисный ключ вашего приложения dev.vk.com; тоже НЕ требует
   прав администратора группы). Способ надёжнее: точные даты и меньше ломается.

Публичные страницы vk.com анонимно контент стены не отдают (login-заглушка),
поэтому нужен хотя бы cookie ЛИБО токен.

Логика (общая для обоих способов):
* Первый запуск — полный проход по стене; далее — только первые 20 постов.
* Среди постов ищем «приглашения оставить отзыв» по ключевым словам.
* Из комментариев к таким постам берём отзывы: имя автора, дату и текст.
* Дубли исключаются по (owner_id, post_id, comment_id).
"""
import re
import ssl
import html
import json
import hashlib
import datetime
import urllib.parse
import urllib.request

from django.conf import settings
from django.utils import timezone

from .models import SiteReview, VkParserState


def _ssl_context():
    """SSL-контекст с надёжным набором корневых сертификатов.

    На некоторых системах системное хранилище CA недоступно из Python
    (ошибка `CERTIFICATE_VERIFY_FAILED: unable to get local issuer certificate`),
    поэтому явно используем бандл `certifi`. При крайней необходимости проверку
    сертификата можно отключить настройкой VK_SSL_VERIFY=False (небезопасно —
    только как временный обходной путь).
    """
    if not getattr(settings, 'VK_SSL_VERIFY', True):
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        return ssl.create_default_context()


def _urlopen(req, timeout=30):
    return urllib.request.urlopen(req, timeout=timeout, context=_ssl_context())

VK_API = 'https://api.vk.com/method/'
MOBILE_UA = ('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) '
             'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1')

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

FULL_SCAN_CAP = 400  # защита от слишком глубокой пагинации


class VkParserError(Exception):
    pass


def _text_has_keyword(text):
    low = (text or '').lower()
    return any(k in low for k in REVIEW_KEYWORDS)


def _strip_tags(s):
    s = re.sub(r'<br\s*/?>', '\n', s or '', flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s).strip()


# ---------------------------------------------------------------------------
# Способ 1. Официальный VK API
# ---------------------------------------------------------------------------

class ApiBackend:
    def __init__(self):
        self.token = getattr(settings, 'VK_ACCESS_TOKEN', '') or ''
        self.domain = getattr(settings, 'VK_GROUP_DOMAIN', 'tc_antrakt')

    def _call(self, method, params):
        q = dict(params)
        q['access_token'] = self.token
        q['v'] = getattr(settings, 'VK_API_VERSION', '5.199')
        url = VK_API + method + '?' + urllib.parse.urlencode(q)
        try:
            with _urlopen(url, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
        except Exception as exc:
            raise VkParserError(f'Ошибка запроса к ВК ({method}): {exc}')
        if 'error' in data:
            raise VkParserError(data['error'].get('error_msg', f'VK API error ({method})'))
        return data.get('response', {}) or {}

    def iter_posts(self, full):
        posts = []
        if full:
            offset, total = 0, None
            while True:
                resp = self._call('wall.get', {'domain': self.domain, 'count': 100, 'offset': offset})
                items = resp.get('items', [])
                if total is None:
                    total = resp.get('count', 0)
                posts.extend(items)
                offset += len(items)
                if not items or offset >= total or offset >= FULL_SCAN_CAP:
                    break
        else:
            resp = self._call('wall.get', {'domain': self.domain, 'count': 20, 'offset': 0})
            posts = resp.get('items', [])
        return [{'owner_id': p.get('owner_id'), 'post_id': p.get('id'),
                 'text': p.get('text', '')} for p in posts]

    def get_comments(self, post):
        resp = self._call('wall.getComments', {
            'owner_id': post['owner_id'], 'post_id': post['post_id'],
            'count': 100, 'extended': 1, 'fields': 'first_name,last_name,photo_100',
        })
        profiles = {}
        for u in resp.get('profiles', []) or []:
            profiles[u['id']] = {
                'name': f"{u.get('first_name', '')} {u.get('last_name', '')}".strip(),
                'photo': u.get('photo_100', ''),
            }
        out = []
        for c in resp.get('items', []):
            prof = profiles.get(c.get('from_id'), {})
            cdate = c.get('date')
            out.append({
                'comment_id': c.get('id'),
                'name': prof.get('name') or 'Зритель',
                'photo': prof.get('photo', ''),
                'date': datetime.date.fromtimestamp(cdate) if cdate else None,
                'text': (c.get('text') or '').strip(),
            })
        return out


# ---------------------------------------------------------------------------
# Способ 2. HTML-парсинг мобильной версии m.vk.com (по cookie)
# ---------------------------------------------------------------------------

# Русские сокращения месяцев в датах m.vk.com («2 июл 2025», «сегодня», «вчера»).
_RU_MONTHS = {
    'янв': 1, 'фев': 2, 'мар': 3, 'апр': 4, 'мая': 5, 'май': 5, 'июн': 6,
    'июл': 7, 'авг': 8, 'сен': 9, 'окт': 10, 'ноя': 11, 'дек': 12,
}


def _parse_ru_date(s):
    s = (s or '').strip().lower()
    if not s:
        return None
    today = timezone.localdate()
    if 'сегодня' in s:
        return today
    if 'вчера' in s:
        return today - datetime.timedelta(days=1)
    m = re.search(r'(\d{1,2})\s+([а-я]{3})[а-я.]*\s*(\d{4})?', s)
    if m:
        day = int(m.group(1))
        mon = _RU_MONTHS.get(m.group(2))
        year = int(m.group(3)) if m.group(3) else today.year
        if mon:
            try:
                return datetime.date(year, mon, day)
            except ValueError:
                return None
    return None


class HtmlBackend:
    def __init__(self):
        cookie = getattr(settings, 'VK_SESSION_COOKIE', '') or ''
        if not cookie:
            raise VkParserError('Не задан VK_SESSION_COOKIE.')
        # Разрешаем передать как «remixsid=...; ...», так и просто значение remixsid.
        self.cookie = cookie if '=' in cookie else f'remixsid={cookie}'
        self.domain = getattr(settings, 'VK_GROUP_DOMAIN', 'tc_antrakt')

    def _fetch(self, url):
        req = urllib.request.Request(url, headers={
            'User-Agent': MOBILE_UA,
            'Accept-Language': 'ru-RU,ru;q=0.9',
            'Cookie': self.cookie,
        })
        try:
            with _urlopen(req, timeout=30) as resp:
                return resp.read().decode('utf-8', 'replace')
        except Exception as exc:
            raise VkParserError(f'Ошибка загрузки {url}: {exc}')

    @staticmethod
    def _extract_post_ids(page_html):
        # Ссылки на посты вида /wall-12345_678
        ids = []
        seen = set()
        for m in re.finditer(r'/wall(-?\d+)_(\d+)', page_html):
            owner_id, post_id = int(m.group(1)), int(m.group(2))
            key = (owner_id, post_id)
            if key not in seen:
                seen.add(key)
                ids.append({'owner_id': owner_id, 'post_id': post_id})
        return ids

    @staticmethod
    def _extract_post_text(post_html):
        # На странице поста текст обычно в .pi_text / .wall_post_text; иначе og:description.
        for pat in (r'<div[^>]*class="[^"]*pi_text[^"]*"[^>]*>(.*?)</div>',
                    r'<div[^>]*class="[^"]*wall_text[^"]*"[^>]*>(.*?)</div>',
                    r'<div[^>]*class="[^"]*pi_text[^"]*"[^>]*>(.*)'):
            m = re.search(pat, post_html, re.S | re.I)
            if m:
                return _strip_tags(m.group(1))
        m = re.search(r'<meta[^>]*property="og:description"[^>]*content="([^"]*)"', post_html, re.I)
        return html.unescape(m.group(1)) if m else ''

    @staticmethod
    def _extract_comments(post_html, owner_id, post_id):
        out = []
        # Каждый комментарий — блок с id="wr_reply<owner>_<cid>" / class="reply".
        blocks = re.split(r'(?=id="wr_reply|class="[^"]*\breply\b)', post_html)
        for b in blocks:
            tm = re.search(r'class="[^"]*reply_text[^"]*"[^>]*>(.*?)</div>', b, re.S | re.I)
            if not tm:
                continue
            text = _strip_tags(tm.group(1))
            if not text:
                continue
            am = (re.search(r'class="[^"]*reply_author[^"]*"[^>]*>(.*?)</a>', b, re.S | re.I)
                  or re.search(r'<a[^>]*href="/(?:id\d+|[a-z0-9_.]+)"[^>]*>(.*?)</a>', b, re.S | re.I))
            name = _strip_tags(am.group(1)) if am else 'Зритель'
            dm = (re.search(r'<time[^>]*>(.*?)</time>', b, re.S | re.I)
                  or re.search(r'class="[^"]*reply_date[^"]*"[^>]*>(.*?)</', b, re.S | re.I))
            date = _parse_ru_date(_strip_tags(dm.group(1))) if dm else None
            cid_m = re.search(r'wr_reply-?\d+_(\d+)', b)
            comment_id = (int(cid_m.group(1)) if cid_m
                          else int(hashlib.md5(f'{post_id}:{name}:{text}'.encode()).hexdigest()[:12], 16))
            out.append({'comment_id': comment_id, 'name': name or 'Зритель',
                        'photo': '', 'date': date, 'text': text})
        return out

    def iter_posts(self, full):
        collected, seen = [], set()
        pages = range(0, FULL_SCAN_CAP, 20) if full else [0]
        for offset in pages:
            page = self._fetch(f'https://m.vk.com/{self.domain}?offset={offset}')
            ids = self._extract_post_ids(page)
            new = [i for i in ids if (i['owner_id'], i['post_id']) not in seen]
            for i in new:
                seen.add((i['owner_id'], i['post_id']))
            collected.extend(new)
            if not new:
                break
            if not full:
                collected = collected[:20]
                break
        return collected

    def get_comments(self, post):
        page = self._fetch(f"https://m.vk.com/wall{post['owner_id']}_{post['post_id']}")
        post['text'] = post.get('text') or self._extract_post_text(page)
        return self._extract_comments(page, post['owner_id'], post['post_id'])

    def enrich_text(self, post):
        # Текст поста нужен ДО решения о ключевых словах; берём со страницы поста.
        if post.get('text'):
            return
        page = self._fetch(f"https://m.vk.com/wall{post['owner_id']}_{post['post_id']}")
        post['_page'] = page
        post['text'] = self._extract_post_text(page)


def _select_backend():
    if getattr(settings, 'VK_SESSION_COOKIE', ''):
        return HtmlBackend()
    if getattr(settings, 'VK_ACCESS_TOKEN', ''):
        return ApiBackend()
    raise VkParserError(
        'Не задан ни VK_SESSION_COOKIE (для HTML-парсинга), ни VK_ACCESS_TOKEN '
        '(для VK API). Укажите одно из значений в Secrets / переменных окружения.'
    )


def parse_reviews(full=False):
    """Основная процедура парсинга. Возвращает dict со статистикой."""
    backend = _select_backend()
    state = VkParserState.get_solo()
    if not state.initial_done:
        full = True  # первый запуск всегда полный

    added = 0
    posts = backend.iter_posts(full)

    # Для HTML-бэкенда текст поста нужно догрузить со страницы поста.
    matched = []
    for post in posts:
        if not post.get('text') and hasattr(backend, 'enrich_text'):
            backend.enrich_text(post)
        if _text_has_keyword(post.get('text', '')):
            matched.append(post)

    for post in matched:
        owner_id, post_id = post['owner_id'], post['post_id']
        source_url = f'https://vk.com/wall{owner_id}_{post_id}'
        for c in backend.get_comments(post):
            text = (c.get('text') or '').strip()
            if not text:
                continue
            _, created = SiteReview.objects.update_or_create(
                vk_owner_id=owner_id, vk_post_id=post_id, vk_comment_id=c.get('comment_id'),
                defaults={
                    'author_name': c.get('name') or 'Зритель',
                    'text': text,
                    'avatar_url': c.get('photo', ''),
                    'review_date': c.get('date'),
                    'source_url': source_url,
                    'source': 'vk',
                    'role': 'Зритель',
                },
            )
            if created:
                added += 1

    state.initial_done = True
    state.last_run_at = timezone.now()
    state.last_result = f'Постов-приглашений: {len(matched)}, новых отзывов: {added}'
    state.save()
    return {'posts': len(matched), 'added': added, 'full': full}
