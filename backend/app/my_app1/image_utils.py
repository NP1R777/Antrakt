"""Заглушка для отсутствующих основных изображений."""
from __future__ import annotations

from django.conf import settings


def resolve_image_url(url: str | None) -> str:
    """Вернуть исходный URL или PLACEHOLDER_IMAGE_URL, если он пуст."""
    if url is not None and str(url).strip():
        return str(url).strip()
    return (getattr(settings, 'PLACEHOLDER_IMAGE_URL', '') or '').strip()
