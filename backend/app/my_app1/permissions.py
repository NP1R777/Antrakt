from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.conf import settings


class IsAdminKey(BasePermission):
    """Allows access only if request contains the correct X-Admin-Key header."""

    def has_permission(self, request, view):
        provided_key = request.headers.get('X-Admin-Key') or request.META.get('HTTP_X_ADMIN_KEY')
        expected_key = getattr(settings, 'ADMIN_PANEL_KEY', None)
        return bool(provided_key and expected_key and provided_key == expected_key)


class IsAdminKeyOrReadOnly(BasePermission):
    """Read for everyone; write only with correct admin key."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        provided_key = request.headers.get('X-Admin-Key') or request.META.get('HTTP_X_ADMIN_KEY')
        expected_key = getattr(settings, 'ADMIN_PANEL_KEY', None)
        return bool(provided_key and expected_key and provided_key == expected_key)