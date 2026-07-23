"""Динамический sitemap.xml и robots.txt для публичного сайта (фронтенд)."""

from xml.sax.saxutils import escape

from django.conf import settings
from django.http import HttpResponse
from django.utils import timezone
from rest_framework.views import APIView

from .models import (
    Achievements,
    Actors,
    Archive,
    DirectorsTheatre,
    News,
    Perfomances,
)


def _site_base() -> str:
    """Базовый URL публичного сайта без завершающего слэша."""
    base = (getattr(settings, 'FRONTEND_BASE_URL', '') or '').strip().rstrip('/')
    if base:
        return base
    # Dev-fallback, если FRONTEND_BASE_URL не задан.
    return 'http://localhost:3000'


def _fmt_lastmod(value) -> str | None:
    if value is None:
        return None
    if timezone.is_aware(value):
        value = timezone.localtime(value)
    try:
        return value.date().isoformat()
    except AttributeError:
        return value.isoformat()[:10]


def _collect_urls():
    """Собрать публичные URL фронтенда для sitemap."""
    base = _site_base()
    urls = []

    def add(path: str, lastmod=None, changefreq='weekly', priority='0.5'):
        loc = f'{base}{path}'
        urls.append({
            'loc': loc,
            'lastmod': _fmt_lastmod(lastmod),
            'changefreq': changefreq,
            'priority': priority,
        })

    # Статические разделы
    add('/', changefreq='daily', priority='1.0')
    add('/afisha', changefreq='daily', priority='0.9')
    add('/performances', changefreq='weekly', priority='0.8')
    add('/team', changefreq='weekly', priority='0.8')
    add('/news', changefreq='daily', priority='0.8')
    add('/projects', changefreq='weekly', priority='0.7')
    add('/achievements', changefreq='monthly', priority='0.6')
    add('/about', changefreq='monthly', priority='0.6')

    for perf in Perfomances.objects.filter(deleted_at=None).only(
        'id', 'updated_at', 'created_at', 'premiere_date'
    ):
        add(
            f'/performance/{perf.id}',
            lastmod=perf.updated_at or perf.premiere_date or perf.created_at,
            changefreq='weekly',
            priority='0.7',
        )

    for actor in Actors.objects.filter(deleted_at=None).only(
        'id', 'updated_at', 'created_at'
    ):
        add(
            f'/actor/{actor.id}',
            lastmod=actor.updated_at or actor.created_at,
            changefreq='monthly',
            priority='0.6',
        )

    for director in DirectorsTheatre.objects.filter(deleted_at=None).only(
        'id', 'updated_at', 'created_at'
    ):
        add(
            f'/director/{director.id}',
            lastmod=director.updated_at or director.created_at,
            changefreq='monthly',
            priority='0.6',
        )

    for item in News.objects.filter(deleted_at=None, is_published=True).only(
        'id', 'updated_at', 'date_publish', 'created_at'
    ):
        add(
            f'/news/{item.id}',
            lastmod=item.updated_at or item.date_publish or item.created_at,
            changefreq='weekly',
            priority='0.7',
        )

    for item in Archive.objects.filter(deleted_at=None).only(
        'id', 'updated_at', 'created_at', 'premiere_date'
    ):
        add(
            f'/projects/{item.id}',
            lastmod=item.updated_at or item.premiere_date or item.created_at,
            changefreq='monthly',
            priority='0.6',
        )

    for item in Achievements.objects.filter(deleted_at=None).only(
        'id', 'updated_at', 'created_at'
    ):
        add(
            f'/achievement/{item.id}',
            lastmod=item.updated_at or item.created_at,
            changefreq='monthly',
            priority='0.5',
        )

    return urls


def _render_sitemap(urls) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for entry in urls:
        lines.append('  <url>')
        lines.append(f'    <loc>{escape(entry["loc"])}</loc>')
        if entry.get('lastmod'):
            lines.append(f'    <lastmod>{entry["lastmod"]}</lastmod>')
        if entry.get('changefreq'):
            lines.append(f'    <changefreq>{entry["changefreq"]}</changefreq>')
        if entry.get('priority'):
            lines.append(f'    <priority>{entry["priority"]}</priority>')
        lines.append('  </url>')
    lines.append('</urlset>')
    return '\n'.join(lines) + '\n'


class SitemapView(APIView):
    """GET /sitemap.xml — карта сайта для поисковиков."""

    authentication_classes = []
    permission_classes = []

    def get(self, request, format=None):
        xml = _render_sitemap(_collect_urls())
        return HttpResponse(xml, content_type='application/xml; charset=utf-8')


class RobotsTxtView(APIView):
    """GET /robots.txt — указывает на sitemap на основном домене."""

    authentication_classes = []
    permission_classes = []

    def get(self, request, format=None):
        base = _site_base()
        body = (
            'User-agent: *\n'
            'Allow: /\n'
            'Disallow: /admin\n'
            'Disallow: /profile\n'
            f'Sitemap: {base}/sitemap.xml\n'
        )
        return HttpResponse(body, content_type='text/plain; charset=utf-8')
