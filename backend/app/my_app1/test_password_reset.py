from datetime import datetime, timedelta
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

from django.core import mail
from django.test import TestCase, override_settings
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient

from .models import PasswordResetLimit, User
from .password_reset import reset_tokens


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend', FRONTEND_BASE_URL='https://theatre.example')
class PasswordResetTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='recovery@test.com', password='Original2026!')
        self.client = APIClient()

    def link_data(self):
        self.user.refresh_from_db()
        return {'uid': urlsafe_base64_encode(force_bytes(self.user.pk)), 'token': reset_tokens.make_token(self.user)}

    def confirm(self, data=None, password='Replacement2026!'):
        return self.client.post('/password-reset/confirm/', {
            **(data if data is not None else self.link_data()), 'new_password': password,
        }, format='json')

    def test_email_links_to_react_page_and_request_changes_nothing(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer expired-or-invalid')
        response = self.client.post('/password-reset/', {'email': self.user.email}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        link = next(line for line in mail.outbox[0].body.splitlines() if line.startswith('https://'))
        self.assertEqual(urlparse(link).netloc, 'theatre.example')
        self.assertEqual(urlparse(link).path, '/reset-password')
        params = parse_qs(urlparse(link).fragment)
        self.assertTrue(reset_tokens.check_token(self.user, params['token'][0]))
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('Original2026!'))
        self.assertEqual(self.user.auth_version, 0)

    @patch('my_app1.views._send_password_reset_email', side_effect=RuntimeError('SMTP credential details'))
    def test_mail_failure_and_unknown_account_have_same_response(self, send):
        first = self.client.post('/password-reset/', {'email': self.user.email}, format='json')
        second = self.client.post('/password-reset/', {'email': 'missing@test.com'}, format='json')
        self.assertEqual(first.status_code, 200)
        self.assertEqual(first.data, second.data)
        self.assertNotIn('SMTP', str(first.data))
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('Original2026!'))
        send.assert_called_once()

    def test_success_revokes_sessions_and_link_cannot_be_reused(self):
        login = self.client.post('/login/', {'email': self.user.email, 'password': 'Original2026!'}, format='json')
        link = self.link_data()
        self.assertEqual(self.confirm(link).status_code, 200)
        self.assertEqual(self.confirm(link).status_code, 400)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        self.assertEqual(self.client.get('/token/verify/').status_code, 401)
        self.assertEqual(self.client.post('/token/refresh/', {'refresh': login.data['refresh']}, format='json').status_code, 401)
        self.client.credentials()
        self.assertEqual(self.client.post('/login/', {'email': self.user.email, 'password': 'Replacement2026!'}, format='json').status_code, 200)

    def test_expired_and_tampered_links_are_rejected(self):
        current = datetime(2026, 1, 1, 12, 0, 0)
        with patch.object(reset_tokens, '_now', return_value=current):
            link = self.link_data()
        with patch.object(reset_tokens, '_now', return_value=current + timedelta(minutes=31)):
            self.assertEqual(self.confirm(link).data['code'], 'invalid_link')
        link = self.link_data()
        link['token'] += 'bad'
        self.assertEqual(self.confirm(link).status_code, 400)

    def test_invalid_input_and_weak_password_do_not_consume_valid_link(self):
        for uid in [None, [], 'invalid', urlsafe_base64_encode(b'99999999999999999999999999')]:
            self.assertEqual(self.confirm({'uid': uid, 'token': 'bad'}).status_code, 400)
        link = self.link_data()
        response = self.confirm(link, '123')
        self.assertEqual(response.status_code, 400)
        self.assertIn('new_password', response.data)
        self.assertEqual(self.confirm(link).status_code, 200)

    def test_deleted_or_restored_account_cannot_use_previous_reset_link(self):
        link = self.link_data()
        self.user.deleted_at = timezone.now()
        self.user.save(update_fields=['deleted_at'])
        self.assertEqual(self.confirm(link).status_code, 400)
        self.user.deleted_at = None
        self.user.save(update_fields=['deleted_at'])
        self.assertEqual(self.confirm(link).status_code, 400)

    def test_second_reset_link_is_also_invalid_after_password_changes(self):
        first, second = self.link_data(), self.link_data()
        self.assertEqual(self.confirm(first).status_code, 200)
        self.assertEqual(self.confirm(second).status_code, 400)

    def test_email_rate_limit_counts_unknown_accounts_and_normalizes_case(self):
        for email in ['MISSING@test.com', 'missing@test.com', ' Missing@test.com ']:
            self.assertEqual(self.client.post('/password-reset/', {'email': email}, format='json').status_code, 200)
        response = self.client.post('/password-reset/', {'email': 'missing@test.com'}, format='json')
        self.assertEqual(response.status_code, 429)
        self.assertIn('Retry-After', response)
        self.assertTrue(all('missing' not in row.key for row in PasswordResetLimit.objects.all()))
        PasswordResetLimit.objects.update(window_started=timezone.now() - timedelta(hours=2))
        self.assertEqual(self.client.post('/password-reset/', {'email': 'missing@test.com'}, format='json').status_code, 200)

    def test_ip_rate_limits_request_and_confirmation_separately(self):
        with patch('my_app1.password_reset.ResetRequestThrottle.ip_limit', 2), patch('my_app1.password_reset.ResetConfirmThrottle.ip_limit', 2):
            for i in range(2):
                self.assertEqual(self.client.post('/password-reset/', {'email': f'unknown{i}@test.com'}, format='json').status_code, 200)
                self.assertEqual(self.confirm({'uid': 'invalid', 'token': 'bad'}).status_code, 400)
            self.assertEqual(self.client.post('/password-reset/', {'email': 'third@test.com'}, format='json').status_code, 429)
            self.assertEqual(self.confirm({'uid': 'invalid', 'token': 'bad'}).status_code, 429)
