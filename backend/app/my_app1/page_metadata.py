"""Одинаковый HTML с серверными метатегами для посетителей и роботов.

React остаётся приложением. Index запрашивается только по фиксированному
внутреннему адресу, независимо от Host, query и содержимого записей.
"""
import json
import re
import urllib.request
from urllib.parse import urlparse

from bs4 import BeautifulSoup
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views import View

from .models import Perfomances, Archive, News, Actors, DirectorsTheatre, Achievements

SITE_NAME = 'Норильский народный театр'
DEFAULT_DESCRIPTION = 'Норильский народный театр — афиша, спектакли, команда и новости. Официальный сайт театра в Норильске.'
STATIC_PAGES = {
    '/': ('Афиша и спектакли', DEFAULT_DESCRIPTION),
    '/afisha': ('Афиша', 'Ближайшие спектакли и события Норильского народного театра. Даты показов и билеты.'),
    '/performances': ('Спектакли', 'Спектакли и репертуар Норильского народного театра.'),
    '/projects': ('Проекты', 'Проекты и события Норильского народного театра.'),
    '/news': ('Новости', 'Новости Норильского народного театра: события, премьеры и жизнь коллектива.'),
    '/team': ('Команда', 'Актёры и режиссёры Норильского народного театра.'),
    '/about': ('О театре', 'История и жизнь Норильского народного театра.'),
    '/achievements': ('Достижения', 'Награды и достижения Норильского народного театра.'),
}


def site_base():
    value = settings.FRONTEND_BASE_URL.strip().rstrip('/')
    parsed = urlparse(value)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname or parsed.username or parsed.password or parsed.path or parsed.query or parsed.fragment:
        raise ImproperlyConfigured('FRONTEND_BASE_URL должен быть абсолютным адресом сайта без пути и параметров.')
    return value


def plain_text(value, limit=180):
    soup = BeautifulSoup(value or '', 'html.parser')
    for node in soup(['script', 'style']):
        node.decompose()
    text = re.sub(r'\s+', ' ', soup.get_text(' ', strip=True)).strip()
    if len(text) > limit:
        text = text[:limit-1].rstrip() + '…'
    return text


def image_url(value):
    value = (value or '').strip()
    parsed = urlparse(value)
    if parsed.scheme in ('http', 'https') and parsed.hostname and not parsed.username and not parsed.password and not any(ord(c) < 32 for c in value):
        return value
    return site_base() + '/logo512.png'


def metadata_for_path(path):
    # Query/tracking never becomes part of canonical. Fragment tokens are not sent.
    if not isinstance(path, str) or len(path) > 2048 or not path.startswith('/') or path.startswith('//') or any(ord(c) < 32 for c in path):
        path = '/invalid-page'
    path = path.split('?', 1)[0].split('#', 1)[0]
    path = path.rstrip('/') or '/'
    base = site_base()
    data = {'path': path, 'title': f'Страница не найдена — {SITE_NAME}',
            'description': 'Такой страницы нет. Перейдите на главную или посмотрите афишу театра.',
            'canonical': None, 'image': base + '/logo512.png', 'type': 'website',
            'site_name': SITE_NAME, 'locale': 'ru_RU', 'noindex': True, 'status': 404, 'redirect': None}
    if path in STATIC_PAGES:
        title, description = STATIC_PAGES[path]
        data.update(title=f'{title} — {SITE_NAME}', description=description,
                    canonical=base+path, noindex=False, status=200)
        return data
    if path == '/archive':
        target = metadata_for_path('/projects')
        return dict(target, path=path, redirect='/projects')
    if path == '/reset-password' or re.fullmatch(r'/profile/[^/]+', path) or path == '/admin' or path.startswith('/admin/'):
        # Не запрашиваем пользователей, их имена или другие персональные данные.
        title = 'Восстановление пароля' if path == '/reset-password' else 'Личный кабинет'
        data.update(title=f'{title} — {SITE_NAME}', description=DEFAULT_DESCRIPTION, status=200)
        return data
    match = re.fullmatch(r'/(afisha/(?:performance|archive)|performance|projects|archive|news|actor|director|achievement)/([1-9]\d{0,14})', path)
    if not match:
        return data
    kind, pk = match[1], int(match[2])
    model = {'performance': Perfomances, 'afisha/performance': Perfomances,
             'projects': Archive, 'archive': Archive, 'afisha/archive': Archive,
             'news': News, 'actor': Actors, 'director': DirectorsTheatre,
             'achievement': Achievements}[kind]
    filters = {'pk': pk, 'deleted_at__isnull': True}
    if model is News:
        filters['is_published'] = True
    item = model.objects.filter(**filters).first()
    if item is None:
        return data
    if model is Perfomances:
        canonical_path = f'/afisha/performance/{pk}' if item.afisha else f'/performance/{pk}'
    elif model is Archive:
        canonical_path = f'/afisha/archive/{pk}' if item.afisha else f'/projects/{pk}'
    else:
        canonical_path = path
    title = plain_text(getattr(item, 'title', None) or getattr(item, 'name', None) or getattr(item, 'achievement', ''), 150)
    description = plain_text(getattr(item, 'description', '')) or f'{title}. {SITE_NAME}.'
    data.update(title=f'{title} — {SITE_NAME}', description=description, image=image_url(item.image_url),
                canonical=base+canonical_path, noindex=False, status=200,
                type='article' if model is News else 'website',
                redirect=canonical_path if canonical_path != path else None)
    return data


def load_spa_index():
    url = getattr(settings, 'PUBLIC_SPA_INDEX_URL', '')
    if not url:
        raise OSError('SPA index is not configured')
    # Внутренний адрес задан оператором, не формируется из входящего запроса.
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), _NoRedirect())
    with opener.open(url, timeout=3) as response:
        if response.status != 200:
            raise OSError('SPA index unavailable')
        body = response.read(2 * 1024 * 1024 + 1)
    if len(body) > 2 * 1024 * 1024:
        raise OSError('SPA index too large')
    text = body.decode('utf-8')
    if '%PUBLIC_URL%' in text:
        raise OSError('SPA index must be a compiled build')
    return text


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def render_spa(index, metadata):
    soup = BeautifulSoup(index, 'html.parser')
    if soup.head is None or soup.find(id='root') is None or soup.find('script', src=True) is None:
        raise ValueError('Invalid SPA index')
    for node in soup.head.select('title, meta[name="description"], meta[name="robots"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], #page-metadata'):
        node.decompose()
    title = soup.new_tag('title')
    title.string = metadata['title']
    soup.head.append(title)
    def meta(key, value, attribute='name'):
        tag = soup.new_tag('meta', attrs={attribute: key, 'content': value})
        soup.head.append(tag)
    meta('description', metadata['description'])
    meta('robots', 'noindex, nofollow' if metadata['noindex'] else 'index, follow')
    if metadata['canonical']:
        soup.head.append(soup.new_tag('link', attrs={'rel': 'canonical', 'href': metadata['canonical']}))
        meta('og:url', metadata['canonical'], 'property')
    for key, value in {'og:title': metadata['title'], 'og:description': metadata['description'],
                       'og:image': metadata['image'], 'og:type': metadata['type'],
                       'og:site_name': SITE_NAME, 'og:locale': 'ru_RU'}.items():
        meta(key, value, 'property')
    for key, value in {'twitter:card': 'summary_large_image', 'twitter:title': metadata['title'],
                       'twitter:description': metadata['description'], 'twitter:image': metadata['image']}.items():
        meta(key, value)
    # Не даём пользовательскому </script> закрыть JSON-блок.
    tag = soup.new_tag('script', attrs={'id': 'page-metadata', 'type': 'application/json'})
    tag.string = json.dumps(metadata, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
    soup.head.append(tag)
    return str(soup)


class PageMetadataView(View):
    http_method_names = ['get', 'head', 'options']
    def get(self, request):
        response = JsonResponse(metadata_for_path(request.GET.get('path', '/')))
        response['Cache-Control'] = 'no-store'
        return response


class PublicPageView(View):
    http_method_names = ['get', 'head', 'options']
    def get(self, request, page_path=''):
        metadata = metadata_for_path('/' + page_path)
        if metadata['redirect']:
            response = HttpResponseRedirect(site_base() + metadata['redirect'])
        else:
            try:
                html = render_spa(load_spa_index(), metadata)
            except (OSError, UnicodeError, ValueError):
                # Не маскируем сбой сборки как успешную публичную страницу.
                response = HttpResponse('Страница временно недоступна. Повторите попытку позже.', status=503, content_type='text/plain; charset=utf-8')
                response['Retry-After'] = '30'
                response['X-Robots-Tag'] = 'noindex'
            else:
                response = HttpResponse(html, status=metadata['status'], content_type='text/html; charset=utf-8')
                if metadata['noindex']:
                    response['X-Robots-Tag'] = 'noindex, nofollow'
        response['Cache-Control'] = 'no-store'
        return response
