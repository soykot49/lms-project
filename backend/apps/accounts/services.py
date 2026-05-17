from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import check_password
from django.db import transaction
from apps.core.services.base import BaseService
from apps.core.exceptions import ValidationException, NotFoundException, BusinessLogicException

User = get_user_model()


class AuthService(BaseService):
    model = User

    def _get_user_by_identifier(self, identifier: str, student_only: bool = False):
        identifier = (identifier or '').strip()
        if not identifier:
            raise ValidationException('Email or student ID is required')

        if student_only:
            qs = User.objects.filter(role='student').select_related('member')
        else:
            qs = User.objects.exclude(role='student')

        user = qs.filter(email__iexact=identifier).first()
        if not user:
            user = qs.filter(member__member_id__iexact=identifier).first()
        if not user:
            raise ValidationException('Invalid credentials')
        return user

    def authenticate_user(self, email: str, password: str) -> User:
        """Staff login (admin / librarian) by email."""
        user = authenticate(username=email, password=password)
        if user is None:
            user = self._get_user_by_identifier(email, student_only=False)
            if not check_password(password, user.password):
                raise ValidationException('Invalid credentials')
        if user.role == 'student':
            raise ValidationException('Students must use the student login page')
        if not user.is_active:
            raise ValidationException('User account is disabled')
        return user

    def authenticate_student(self, identifier: str, password: str) -> User:
        """Student login by email or member ID."""
        user = self._get_user_by_identifier(identifier, student_only=True)
        if not check_password(password, user.password):
            raise ValidationException('Invalid credentials')
        if not user.is_active:
            raise ValidationException(
                'Your account is pending approval. Please contact the library admin.'
            )
        if user.member and user.member.is_blocked:
            raise ValidationException('Your library account has been blocked')
        return user

    @transaction.atomic
    def register_student(self, member_data: dict, password: str) -> User:
        from apps.members.models import Member

        member_id = member_data['member_id'].strip().upper()
        email = member_data['email'].strip().lower()

        if Member.objects.filter(member_id__iexact=member_id).exists():
            raise BusinessLogicException('Student ID is already registered')
        if Member.objects.filter(email__iexact=email).exists():
            raise BusinessLogicException('Email is already registered')
        if User.objects.filter(email__iexact=email).exists():
            raise BusinessLogicException('Email is already in use')

        member = Member.objects.create(
            member_id=member_id,
            first_name=member_data['first_name'],
            last_name=member_data['last_name'],
            email=email,
            phone=member_data.get('phone', ''),
            member_type=member_data.get('member_type', 'student'),
        )

        user = User.objects.create_user(
            username=member_id,
            email=email,
            password=password,
            first_name=member.first_name,
            last_name=member.last_name,
            role='student',
            member=member,
            is_active=False,
        )
        return user

    def get_user_by_email(self, email: str) -> User:
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            raise NotFoundException('User not found')
