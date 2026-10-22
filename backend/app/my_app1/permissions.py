from rest_framework.permissions import BasePermission, SAFE_METHODS


def is_superuser(user):
    return bool(user and user.is_authenticated and user.is_superuser)


class IsSuperUser(BasePermission):
    """The site's administrator role is is_superuser, not is_staff."""

    def has_permission(self, request, view):
        return is_superuser(request.user)


class ReadOnlyOrSuperUser(IsSuperUser):
    """Public reading; only administrators may change site content."""

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or super().has_permission(request, view)
