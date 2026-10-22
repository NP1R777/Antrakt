from unittest.mock import patch

from django.contrib.auth import authenticate, get_user
from django.test import TestCase, Client
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class AccountSessionTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='sessions@test.com', phone_number='+70000000001', password='Original2026!',
        )
        self.admin = User.objects.create_superuser(email='sessions-admin@test.com', password='Admin2026!')
        self.client = APIClient()
        self.admin_client = APIClient()
        self.admin_client.force_authenticate(self.admin)

    def login(self, **credentials):
        response = self.client.post('/login/', credentials or {
            'email': self.user.email, 'password': 'Original2026!',
        }, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        return response.data

    def verify(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        return self.client.get('/token/verify/')

    def refresh(self, token):
        client = APIClient()
        return client.post('/token/refresh/', {'refresh': token}, format='json')

    def delete_account(self):
        response = self.admin_client.delete(f'/user{self.user.pk}/')
        self.assertEqual(response.status_code, 204)

    def restore_account(self):
        response = self.admin_client.put(f'/user{self.user.pk}/', {'deleted_at': None}, format='json')
        self.assertEqual(response.status_code, 200, response.data)

    def test_active_account_login_by_email_and_phone_and_rotation(self):
        for identifier in [{'email': self.user.email}, {'phone_number': self.user.phone_number}]:
            tokens = self.login(password='Original2026!', **identifier)
            self.assertEqual(self.verify(tokens['access']).status_code, 200)
            response = self.refresh(tokens['refresh'])
            self.assertEqual(response.status_code, 200, response.data)
            self.assertEqual(self.verify(response.data['access']).status_code, 200)
            self.assertEqual(self.refresh(tokens['refresh']).status_code, 401)
            self.assertEqual(self.refresh(response.data['refresh']).status_code, 200)
            self.client.credentials()

    def test_deleted_account_cannot_login_by_email_or_phone(self):
        self.delete_account()
        for identifier in [{'email': self.user.email}, {'phone_number': self.user.phone_number}]:
            response = self.client.post('/login/', {'password': 'Original2026!', **identifier}, format='json')
            self.assertEqual(response.status_code, 401, response.data)
        self.assertIsNone(authenticate(email=self.user.email, password='Original2026!'))

    def test_all_old_sessions_stay_revoked_after_restoration(self):
        first = self.login()
        second = self.login()
        self.delete_account()
        for tokens in [first, second]:
            self.assertEqual(self.verify(tokens['access']).status_code, 401)
            self.assertEqual(self.refresh(tokens['refresh']).status_code, 401)
        self.restore_account()
        for tokens in [first, second]:
            self.assertEqual(self.verify(tokens['access']).status_code, 401)
            self.assertEqual(self.refresh(tokens['refresh']).status_code, 401)
        self.client.credentials()
        tokens = self.login()
        self.assertEqual(self.verify(tokens['access']).status_code, 200)
        self.assertEqual(self.refresh(tokens['refresh']).status_code, 200)

    def test_user_can_delete_self_but_cannot_restore_self(self):
        tokens = self.login()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
        self.assertEqual(self.client.delete(f'/user{self.user.pk}/').status_code, 204)
        self.assertEqual(self.client.put(f'/user{self.user.pk}/', {'deleted_at': None}, format='json').status_code, 401)

    def test_password_change_revokes_old_access_and_refresh(self):
        tokens = self.login()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
        response = self.client.post('/change-password/', {
            'current_password': 'Original2026!', 'new_password': 'Replacement2026!',
        }, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(self.verify(tokens['access']).status_code, 401)
        self.assertEqual(self.refresh(tokens['refresh']).status_code, 401)
        self.client.credentials()
        fresh = self.login(email=self.user.email, password='Replacement2026!')
        self.assertEqual(self.verify(fresh['access']).status_code, 200)

    def test_profile_edit_does_not_revoke_sessions_or_revive_deleted_user(self):
        tokens = self.login()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
        self.assertEqual(self.client.put(f'/user{self.user.pk}/', {'profile_photo': ''}, format='json').status_code, 200)
        self.assertEqual(self.verify(tokens['access']).status_code, 200)
        self.delete_account()
        from .serializers import UserSerializer
        # A profile instance read before deletion must not overwrite deleted_at.
        serializer = UserSerializer(self.user, data={'profile_photo': ''}, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.deleted_at)

    @patch('my_app1.views._send_new_password_email')
    def test_password_reset_ignores_deleted_accounts(self, send):
        self.delete_account()
        response = self.client.post('/password-reset/', {'email': self.user.email}, format='json')
        self.assertEqual(response.status_code, 200)
        send.assert_not_called()
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('Original2026!'))

    def test_hard_deleted_account_refresh_returns_401(self):
        tokens = self.login()
        self.assertEqual(self.admin_client.delete(f'/user{self.user.pk}/?hard=1').status_code, 204)
        self.assertEqual(self.verify(tokens['access']).status_code, 401)
        self.assertEqual(self.refresh(tokens['refresh']).status_code, 401)

    def test_legacy_tokens_without_version_require_login(self):
        token = RefreshToken.for_user(self.user)
        self.assertEqual(self.verify(str(token.access_token)).status_code, 401)
        self.assertEqual(self.refresh(str(token)).status_code, 401)

    def test_django_session_does_not_revive_after_restoration(self):
        browser = Client()
        self.assertTrue(browser.login(email=self.user.email, password='Original2026!'))
        original_session = browser.session
        self.delete_account()
        self.restore_account()
        request = type('SessionRequest', (), {'session': original_session})()
        self.assertFalse(get_user(request).is_authenticated)

    def test_model_lifecycle_change_advances_version_and_clears_stored_tokens(self):
        self.user.access_token = 'old-access'
        self.user.refresh_token = 'old-refresh'
        self.user.save(update_fields=['access_token', 'refresh_token'])
        self.user.deleted_at = timezone.now()
        self.user.save(update_fields=['deleted_at'])
        self.assertEqual(self.user.auth_version, 1)
        self.assertIsNone(self.user.access_token)
        self.assertIsNone(self.user.refresh_token)
        self.user.deleted_at = None
        self.user.save(update_fields=['deleted_at'])
        self.assertEqual(self.user.auth_version, 2)
