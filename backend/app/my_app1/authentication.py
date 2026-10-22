from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


def check_session(user, token):
    if not user.is_active or token.get('auth_version') != user.auth_version:
        raise AuthenticationFailed('Сеанс завершён. Войдите заново.', code='session_revoked')


class VersionedJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        check_session(user, validated_token)
        return user
