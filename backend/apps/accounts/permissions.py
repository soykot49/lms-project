from rest_framework.permissions import BasePermission


class IsStaffUser(BasePermission):
    """Admin or librarian only."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role in ('admin', 'librarian')
        )


class IsStudentUser(BasePermission):
    """Student portal user with linked member profile."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role == 'student'
            and getattr(user, 'member_id', None)
        )
