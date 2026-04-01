from django.contrib.auth import get_user_model, authenticate
from apps.core.services.base import BaseService
from apps.core.exceptions import ValidationException, NotFoundException

User = get_user_model()


class AuthService(BaseService):
    model = User
    
    def authenticate_user(self, email: str, password: str) -> User:
        """Authenticate user with email and password"""
        user = authenticate(username=email, password=password)
        if user is None:
            raise ValidationException("Invalid credentials")
        if not user.is_active:
            raise ValidationException("User account is disabled")
        return user
    
    def get_user_by_email(self, email: str) -> User:
        """Get user by email"""
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            raise NotFoundException("User not found")
