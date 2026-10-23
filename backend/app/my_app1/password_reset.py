from datetime import timedelta

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db import transaction
from django.utils import timezone
from django.utils.crypto import salted_hmac
from rest_framework.throttling import BaseThrottle

from .models import PasswordResetLimit


class ResetTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return super()._make_hash_value(user, timestamp) + f':{user.auth_version}:{user.deleted_at}'


reset_tokens = ResetTokenGenerator()


class ResetRequestThrottle(BaseThrottle):
    scope = 'request'
    ip_limit = 20
    email_limit = 3

    def allow_request(self, request, view):
        now = timezone.now()
        PasswordResetLimit.objects.filter(window_started__lt=now - timedelta(days=1)).delete()
        keys = [(f'{self.scope}:ip:{self.get_ident(request)}', self.ip_limit)]
        if self.email_limit and isinstance(request.data, dict):
            email = request.data.get('email')
            if isinstance(email, str):
                keys.append((f'{self.scope}:email:{email.strip().casefold()}', self.email_limit))
        self.retry_after = 0
        # Database counters are shared by Gunicorn workers. Never store raw email/IP.
        with transaction.atomic():
            counters = []
            for value, limit in sorted(keys):
                key = salted_hmac('password-reset-rate', value, algorithm='sha256').hexdigest()
                row, _ = PasswordResetLimit.objects.select_for_update().get_or_create(
                    key=key, defaults={'window_started': now},
                )
                remaining = (row.window_started + timedelta(hours=1) - now).total_seconds()
                if remaining <= 0:
                    row.window_started, row.count = now, 0
                    remaining = 3600
                if row.count >= limit:
                    self.retry_after = max(self.retry_after, remaining)
                counters.append(row)
            if self.retry_after:
                return False
            for row in counters:
                row.count += 1
                row.save(update_fields=['window_started', 'count'])
        return True

    def wait(self):
        return self.retry_after


class ResetConfirmThrottle(ResetRequestThrottle):
    scope = 'confirm'
    ip_limit = 60
    email_limit = 0
