"""Отзывы VK: первые 20 постов, расширенный первый запуск, без премодерации.

Сетевой/HTML слой не удаляет отзывы. Импорт запускается через vk_jobs, чтобы
кнопка, расписание и CLI разделяли одну блокировку и один журнал заданий.
"""
import datetime
import json
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request

from bs4 import BeautifulSoup
from django.conf import settings
from django.db import transaction
from django.utils import timezone

from .models import SiteReview, VkParserState

VK_API = 'https://api.vk.com/method/'
MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
FULL_SCAN_CAP = 400
REVIEW_KEYWORDS = [
    'делитесь своими впечатлениями', 'поделитесь своими впечатлениями',
    'поделитесь впечатлениями', 'оставить отзыв', 'оставьте отзыв',
    'оставьте свой отзыв', 'оставить свой отзыв', 'оставьте отзыв о нашем спектакле',
    'ваши впечатления', 'ваш отзыв', 'напишите отзыв', 'ждем ваши отзывы',
]


class VkParserError(Exception):
    def __init__(self, message, *, retryable=False, partial=False):
        super().__init__(message)
        self.retryable = retryable
        self.partial = partial


def _text_has_keyword(text):
    low = re.sub(r'\s+', ' ', (text or '').lower().replace('ё', 'е'))
    return any(k in low for k in REVIEW_KEYWORDS)


def configured_backend():
    domain = getattr(settings, 'VK_GROUP_DOMAIN', 'tc_antrakt').strip()
    if not re.fullmatch(r'[A-Za-z0-9_.-]{1,100}', domain):
        raise VkParserError('Некорректный VK_GROUP_DOMAIN.')
    mode = getattr(settings, 'VK_IMPORT_BACKEND', 'auto').lower()
    cookie = bool(getattr(settings, 'VK_SESSION_COOKIE', '').strip())
    token = bool(getattr(settings, 'VK_ACCESS_TOKEN', '').strip())
    if mode not in ('auto', 'api', 'html'):
        raise VkParserError('VK_IMPORT_BACKEND должен быть auto, api или html.')
    if mode == 'auto':
        mode = 'html' if cookie else 'api' if token else ''
    if not mode or (mode == 'html' and not cookie) or (mode == 'api' and not token):
        raise VkParserError('Интеграция VK не настроена: требуется cookie или API-токен выбранного режима.')
    return mode, domain


def _ssl_context():
    # Системные CA + certifi; дополнительный корпоративный CA не отключает TLS.
    import certifi
    context = ssl.create_default_context()
    context.load_verify_locations(certifi.where())
    if getattr(settings, 'VK_IMPORT_CA_BUNDLE', ''):
        try:
            context.load_verify_locations(settings.VK_IMPORT_CA_BUNDLE)
        except (OSError, ssl.SSLError):
            raise VkParserError('Не удалось загрузить VK_IMPORT_CA_BUNDLE.') from None
    return context


class _VkRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        parsed = urllib.parse.urlparse(newurl)
        if parsed.scheme != 'https' or parsed.hostname not in ('vk.com', 'm.vk.com', 'api.vk.com'):
            raise VkParserError('VK перенаправил запрос на страницу входа или проверки доступа.')
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _urlopen(req, timeout=30):
    opener = urllib.request.build_opener(_VkRedirectHandler(), urllib.request.HTTPSHandler(context=_ssl_context()))
    return opener.open(req, timeout=timeout)


class Transport:
    def __init__(self, progress=None):
        self.progress = progress or (lambda *args: None)
        self.last_request = 0.0
        self.truncated_wall = False

    def request(self, req):
        attempts = max(1, min(5, getattr(settings, 'VK_IMPORT_HTTP_ATTEMPTS', 3)))
        for attempt in range(attempts):
            self.progress('Запрос к VK')
            interval = max(0.0, getattr(settings, 'VK_IMPORT_REQUEST_INTERVAL', 0.35))
            time.sleep(max(0, interval - (time.monotonic() - self.last_request)))
            self.last_request = time.monotonic()
            try:
                with _urlopen(req, timeout=30) as response:
                    body = response.read(8 * 1024 * 1024 + 1)
                if len(body) > 8 * 1024 * 1024:
                    raise VkParserError('Ответ VK превышает допустимый размер.')
                return body.decode('utf-8', 'strict')
            except urllib.error.HTTPError as exc:
                retry = exc.code == 429 or 500 <= exc.code < 600
                error = VkParserError(f'VK вернул HTTP {exc.code}.', retryable=retry)
            except (urllib.error.URLError, TimeoutError, OSError):
                error = VkParserError('Не удалось связаться с VK. Проверьте сеть и TLS-сертификаты.', retryable=True)
            except UnicodeError:
                raise VkParserError('VK вернул некорректный текст ответа.') from None
            if not error.retryable or attempt + 1 == attempts:
                raise error from None
            self.progress('Повтор временно недоступного запроса')
            time.sleep(min(2 ** attempt, 8))


class ApiBackend(Transport):
    def __init__(self, progress=None):
        super().__init__(progress)
        self.token = settings.VK_ACCESS_TOKEN.strip()
        self.domain = settings.VK_GROUP_DOMAIN.strip()

    def _call(self, method, params):
        query = dict(params, access_token=self.token, v=getattr(settings, 'VK_API_VERSION', '5.199'))
        req = urllib.request.Request(VK_API + method, data=urllib.parse.urlencode(query).encode(), method='POST')
        attempts = max(1, min(5, getattr(settings, 'VK_IMPORT_HTTP_ATTEMPTS', 3)))
        for attempt in range(attempts):
            try:
                data = json.loads(self.request(req))
            except (ValueError, TypeError):
                raise VkParserError('VK API вернул некорректный JSON.') from None
            if not isinstance(data, dict):
                raise VkParserError('VK API вернул некорректную структуру ответа.')
            if 'error' in data:
                error = data['error'] if isinstance(data['error'], dict) else {}
                code = error.get('error_code')
                retry = code in (1, 6, 9, 10, 29)
                if retry and attempt + 1 < attempts:
                    self.progress('Ожидание после ограничения VK API')
                    time.sleep(min(2 ** attempt, 8))
                    continue
                messages = {5: 'Ошибка авторизации VK API.', 14: 'VK требует капчу.',
                            15: 'VK API запретил доступ.', 17: 'VK требует подтверждение входа.',
                            28: 'VK отклонил токен приложения.', 212: 'Комментарии VK недоступны.'}
                raise VkParserError(messages.get(code, 'Ошибка VK API.'), retryable=retry)
            response = data.get('response')
            if (not isinstance(response, dict) or not isinstance(response.get('items'), list)
                    or not isinstance(response.get('count'), int) or response['count'] < 0):
                raise VkParserError('VK API не вернул ожидаемый список и количество записей.')
            return response

    def iter_posts(self, full):
        posts, seen, offset = [], set(), 0
        limit = FULL_SCAN_CAP if full else 20
        while offset < limit:
            response = self._call('wall.get', {'domain': self.domain, 'count': min(100, limit-offset), 'offset': offset})
            items = response['items']
            for item in items:
                if not isinstance(item, dict) or not isinstance(item.get('id'), int) or not isinstance(item.get('owner_id'), int):
                    raise VkParserError('VK API вернул пост без идентификатора.')
                key = item['owner_id'], item['id']
                if key not in seen:
                    seen.add(key)
                    posts.append({'owner_id': key[0], 'post_id': key[1], 'text': item.get('text') or ''})
            offset += len(items)
            if not full or offset >= response['count']:
                break
            if not items:
                raise VkParserError('VK API оборвал загрузку стены.', partial=True)
        if full and offset < response['count']:
            self.truncated_wall = True
        return posts[:limit]

    def get_comments(self, post):
        offset, seen = 0, set()
        limit = max(100, getattr(settings, 'VK_IMPORT_MAX_COMMENTS', 10000))
        while offset < limit:
            response = self._call('wall.getComments', {
                'owner_id': post['owner_id'], 'post_id': post['post_id'], 'count': min(100, limit-offset),
                'offset': offset, 'extended': 1, 'fields': 'photo_100',
                'preview_length': 0, 'sort': 'asc', 'thread_items_count': 0,
            })
            profiles = {p['id']: p for p in response.get('profiles', []) if isinstance(p, dict) and 'id' in p}
            for comment in response['items']:
                if not isinstance(comment, dict):
                    raise VkParserError('VK API вернул повреждённый комментарий.')
                cid = comment.get('id')
                if not isinstance(cid, int) or cid <= 0:
                    yield {'skip': True}
                    continue
                if cid in seen:
                    raise VkParserError('VK API повторяет страницу комментариев.', partial=True)
                seen.add(cid)
                # Удалённые, вложенные ответы и сообщения от сообществ не выдаём за отзывы зрителей.
                if comment.get('deleted') or comment.get('parents_stack') or comment.get('reply_to_comment') or comment.get('from_id', 0) <= 0:
                    yield {'skip': True}
                    continue
                profile = profiles.get(comment.get('from_id'), {})
                date = comment.get('date')
                try:
                    date = timezone.localdate(datetime.datetime.fromtimestamp(date, datetime.timezone.utc)) if date else None
                except (ValueError, TypeError, OverflowError, OSError):
                    date = None
                yield {'comment_id': cid, 'name': f"{profile.get('first_name', '')} {profile.get('last_name', '')}".strip() or 'Зритель',
                       'photo': profile.get('photo_100', ''), 'date': date, 'text': comment.get('text') or ''}
            offset += len(response['items'])
            # count может включать вложенные ответы; мы читаем только верхний уровень.
            total = response.get('current_level_count', response['count'])
            if not isinstance(total, int) or total < 0:
                raise VkParserError('VK API вернул некорректное количество комментариев.')
            if offset >= total:
                return
            if not response['items']:
                raise VkParserError('VK API оборвал загрузку комментариев.', partial=True)
        raise VkParserError('Достигнут предел числа комментариев.', partial=True)


_RU_MONTHS = {'янв': 1, 'фев': 2, 'мар': 3, 'апр': 4, 'мая': 5, 'май': 5,
              'июн': 6, 'июл': 7, 'авг': 8, 'сен': 9, 'окт': 10, 'ноя': 11, 'дек': 12}


def _parse_ru_date(value):
    value = value.strip().lower()
    today = timezone.localdate()
    if 'сегодня' in value:
        return today
    if 'вчера' in value:
        return today - datetime.timedelta(days=1)
    # Без года достоверно восстановить дату старого комментария нельзя.
    match = re.search(r'(\d{1,2})\s+([а-я]{3})[а-я.]*\s+(\d{4})\b', value)
    if match:
        try:
            return datetime.date(int(match[3]), _RU_MONTHS[match[2]], int(match[1]))
        except (KeyError, ValueError):
            pass
    return None


def _soup(page):
    soup = BeautifulSoup(page, 'html.parser')
    if soup.select_one('input[name="password"], input[name="captcha_key"], form[action*="login"], form[action*="captcha"]'):
        raise VkParserError('VK требует вход или капчу. Обновите доступ к интеграции.')
    return soup


def _node_text(node):
    if not node:
        return ''
    # Не разрываем обычные inline-теги; переводы строк сохраняем только для br.
    for br in node.find_all('br'):
        br.replace_with('\n')
    return node.get_text().strip()


class HtmlBackend(Transport):
    def __init__(self, progress=None):
        super().__init__(progress)
        cookie = settings.VK_SESSION_COOKIE.strip()
        self.cookie = cookie if re.match(r'(?:remixsid|remixsid6)=', cookie) else f'remixsid={cookie}'
        self.domain = settings.VK_GROUP_DOMAIN.strip()

    def _fetch(self, url):
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme != 'https' or parsed.hostname != 'm.vk.com':
            raise VkParserError('Некорректный адрес страницы VK.')
        return self.request(urllib.request.Request(url, headers={'User-Agent': MOBILE_UA, 'Accept-Language': 'ru-RU', 'Cookie': self.cookie}))

    @staticmethod
    def _extract_post_ids(page):
        soup = _soup(page)
        result, seen = [], set()
        # Ищем контейнеры постов/ссылки на сам пост, а не любые упоминания wall в тексте.
        for node in soup.select('[id^="post"], .wall_item .wi_date, .wall_item .item_date, .wall_item .wi_info a[href*="wall"]'):
            value = node.get('id', '') + ' ' + node.get('href', '')
            match = re.search(r'(?:wall|post)(-?\d+)_(\d+)', value)
            if match:
                key = int(match[1]), int(match[2])
                if key not in seen:
                    seen.add(key)
                    result.append({'owner_id': key[0], 'post_id': key[1]})
        if not result and not soup.select_one('.wall_empty'):
            raise VkParserError('Не удалось распознать стену VK: вход, ограничение или новая разметка.')
        if not result and soup.select_one('.wall_item'):
            raise VkParserError('Не удалось распознать идентификаторы постов VK.')
        return result

    @staticmethod
    def _extract_post_text(page):
        soup = _soup(page)
        node = soup.select_one('.pi_text, .wall_text, .wall_post_text')
        if node is None:
            raise VkParserError('Не удалось распознать текст поста VK.')
        return _node_text(node)

    @staticmethod
    def _extract_comments(page, owner_id, post_id):
        soup = _soup(page)
        comments = []
        for node in soup.select('[id^="wr_reply"], .reply'):
            # Вложенные элементы reply могут встречаться в одном контейнере.
            if node.find_parent(id=re.compile(r'^wr_reply')) or node.find_parent(class_='reply'):
                continue
            text = node.select_one('.reply_text')
            if text is None:
                continue
            match = re.fullmatch(r'wr_reply(-?\d+)_(\d+)', node.get('id', ''))
            if not match or int(match[1]) != owner_id:
                comments.append({'skip': True})
                continue
            if node.select_one('.reply_to') or 'reply_to' in node.get('class', []):
                comments.append({'skip': True})
                continue
            author = node.select_one('.reply_author')
            if author and re.search(r'/(?:club|public)\d+', author.get('href', '')):
                comments.append({'skip': True})
                continue
            date_node = node.select_one('time, .reply_date')
            date = None
            if date_node:
                try:
                    if date_node.get('datetime'):
                        stamp = datetime.datetime.fromisoformat(date_node['datetime'].replace('Z', '+00:00'))
                        date = timezone.localdate(stamp) if timezone.is_aware(stamp) else stamp.date()
                    else:
                        date = _parse_ru_date(date_node.get_text())
                except (TypeError, ValueError):
                    pass
            comments.append({'comment_id': int(match[2]), 'name': _node_text(author) or 'Зритель',
                             'photo': '', 'date': date, 'text': _node_text(text)})
        if not comments:
            container = soup.select_one('.replies, #replies, .replies_list, .wall_replies, .reply_empty')
            if container is None or soup.select_one('.reply, [id^="wr_reply"]') or (container.get_text(strip=True) and not soup.select_one('.reply_empty')):
                raise VkParserError('Не удалось распознать комментарии VK.')
        return comments

    def iter_posts(self, full):
        result, seen = [], set()
        for offset in range(0, FULL_SCAN_CAP if full else 20, 20):
            page = self._fetch(f'https://m.vk.com/{self.domain}?offset={offset}')
            posts = self._extract_post_ids(page)
            new = [p for p in posts if (p['owner_id'], p['post_id']) not in seen]
            if not new:
                return result
            for post in new:
                seen.add((post['owner_id'], post['post_id']))
            result.extend(new)
            if not full:
                return result[:20]
        # Не выдаём ограниченный расширенный обход за всю стену.
        if self._extract_post_ids(self._fetch(f'https://m.vk.com/{self.domain}?offset={FULL_SCAN_CAP}')):
            self.truncated_wall = True
        return result

    def enrich_text(self, post):
        page = self._fetch(f"https://m.vk.com/wall{post['owner_id']}_{post['post_id']}")
        post['_page'] = page
        post['text'] = self._extract_post_text(page)

    def get_comments(self, post):
        url = f"https://m.vk.com/wall{post['owner_id']}_{post['post_id']}"
        page = post.pop('_page', None)
        seen, pages = set(), set()
        count = 0
        while True:
            if url in pages:
                raise VkParserError('VK повторяет страницу комментариев.', partial=True)
            pages.add(url)
            page = page if page is not None else self._fetch(url)
            for comment in self._extract_comments(page, post['owner_id'], post['post_id']):
                if comment.get('comment_id') in seen:
                    continue
                if comment.get('comment_id'):
                    seen.add(comment['comment_id'])
                count += 1
                if count > max(100, getattr(settings, 'VK_IMPORT_MAX_COMMENTS', 10000)):
                    raise VkParserError('Достигнут предел числа комментариев.', partial=True)
                yield comment
            soup = _soup(page)
            next_link = soup.select_one('a.pg_next[href], a[rel="next"][href], .replies a.show_more[href]')
            if not next_link:
                return
            url = urllib.parse.urljoin(url, next_link['href'])
            parsed = urllib.parse.urlparse(url)
            if parsed.hostname != 'm.vk.com' or parsed.path != f"/wall{post['owner_id']}_{post['post_id']}":
                raise VkParserError('Некорректная ссылка следующей страницы комментариев VK.', partial=True)
            if len(pages) >= 200:
                raise VkParserError('Достигнут предел страниц комментариев.', partial=True)
            page = None


def _select_backend(mode=None, progress=None):
    if mode is None:
        mode, _ = configured_backend()
    return (HtmlBackend if mode == 'html' else ApiBackend)(progress)


def import_reviews(full=False, *, backend=None, progress=None, stats=None):
    """Внутренний импорт: вызывается только под блокировкой vk_jobs."""
    progress = progress or (lambda *args: None)
    backend = backend or _select_backend(progress=progress)
    state = VkParserState.get_solo()
    same_group = state.group_domain in ('', backend.domain)
    full = full or not (same_group and state.initial_done)
    stats = stats if stats is not None else {}
    for key in ('scanned', 'posts', 'comments', 'added', 'updated', 'unchanged', 'skipped'):
        stats.setdefault(key, 0)
    stats['full'] = full
    progress('Чтение стены', stats)
    posts = backend.iter_posts(full)
    for post in posts:
        stats['scanned'] += 1
        progress('Проверка поста', stats)
        if not post.get('text') and hasattr(backend, 'enrich_text'):
            backend.enrich_text(post)
        if not _text_has_keyword(post.get('text', '')):
            continue
        stats['posts'] += 1
        for comment in backend.get_comments(post):
            stats['comments'] += 1
            cid = comment.get('comment_id')
            text = (comment.get('text') or '').strip()
            if comment.get('skip') or not text or not isinstance(cid, int) or cid <= 0:
                stats['skipped'] += 1
                continue
            defaults = {'author_name': (comment.get('name') or 'Зритель')[:200], 'text': text,
                        'avatar_url': (comment.get('photo') or '')[:500], 'review_date': comment.get('date'),
                        'source_url': f"https://vk.com/wall{post['owner_id']}_{post['post_id']}?reply={cid}",
                        'source': 'vk', 'role': 'Зритель', 'rating': None}
            # Сеть вне транзакции; блокировка строки согласует импорт и ручное исключение.
            checkpoint = dict(stats)
            try:
                with transaction.atomic():
                    obj, created = SiteReview.objects.select_for_update().get_or_create(
                        vk_owner_id=post['owner_id'], vk_post_id=post['post_id'], vk_comment_id=cid, defaults=defaults)
                    if obj.excluded:
                        stats['skipped'] += 1
                    elif created:
                        stats['added'] += 1
                    elif any(getattr(obj, key) != value for key, value in defaults.items()):
                        for key, value in defaults.items():
                            setattr(obj, key, value)
                        obj.save(update_fields=[*defaults, 'updated_at'])
                        stats['updated'] += 1
                    else:
                        stats['unchanged'] += 1
                    progress('Сохранение отзывов', stats)
            except Exception:
                # Если запись прогресса не удалась, отзыв откатывается вместе с ней.
                stats.clear()
                stats.update(checkpoint)
                raise
    if getattr(backend, 'truncated_wall', False):
        raise VkParserError('Обработаны первые 400 постов; расширенный проход неполный.', partial=True)
    state.initial_done = True
    state.group_domain = backend.domain
    state.last_run_at = timezone.now()
    state.last_result = f"Постов: {stats['posts']}, новых: {stats['added']}, обновлено: {stats['updated']}"
    state.save()
    progress('Завершено', stats)
    return stats


def parse_reviews(full=False):
    """Совместимый синхронный вход CLI, с общей блокировкой и журналом."""
    from .vk_jobs import run_sync
    return run_sync(full=full)
