from django.contrib.auth import get_user_model
from django.db import transaction
from apps.core.services.base import BaseService
from apps.core.exceptions import BusinessLogicException
from .models import Member

User = get_user_model()


class MemberService(BaseService):
    model = Member
    
    def block_member(self, member_id: int):
        '''Block a member from borrowing books'''
        member = self.get_object(member_id)
        if member.is_blocked:
            raise BusinessLogicException("Member is already blocked")
        member.is_blocked = True
        member.save()
        return member
    
    def unblock_member(self, member_id: int):
        '''Unblock a member'''
        member = self.get_object(member_id)
        if not member.is_blocked:
            raise BusinessLogicException("Member is not blocked")
        member.is_blocked = False
        member.save()
        return member
    
    def get_member_history(self, member_id: int):
        '''Get borrowing history of a member'''
        member = self.get_object(member_id)
        return member.transactions.all().order_by('-issue_date')
    
    @transaction.atomic
    def create_with_account(self, data: dict) -> Member:
        payload = dict(data)
        password = payload.pop('password', None) or ''
        create_login = payload.pop('create_login', False)
        activate = payload.pop('activate_account', False)

        member_id = payload.get('member_id', '').strip().upper()
        email = payload.get('email', '').strip().lower()
        payload['member_id'] = member_id
        payload['email'] = email

        member = self.create(payload)

        if create_login or password:
            if User.objects.filter(email__iexact=email).exists():
                raise BusinessLogicException('Email already has a login account')
            User.objects.create_user(
                username=member_id,
                email=email,
                password=password or 'ChangeMe123!',
                first_name=member.first_name,
                last_name=member.last_name,
                role='student',
                member=member,
                is_active=bool(activate),
            )
        return member

    def activate_account(self, member_id: int) -> Member:
        member = self.get_object(member_id)
        if not hasattr(member, 'user_account'):
            raise BusinessLogicException('Member has no login account')
        user = member.user_account
        if user.is_active:
            raise BusinessLogicException('Account is already active')
        user.is_active = True
        user.save(update_fields=['is_active'])
        return member

    def deactivate_account(self, member_id: int) -> Member:
        member = self.get_object(member_id)
        if not hasattr(member, 'user_account'):
            raise BusinessLogicException('Member has no login account')
        user = member.user_account
        if not user.is_active:
            raise BusinessLogicException('Account is already inactive')
        user.is_active = False
        user.save(update_fields=['is_active'])
        return member

    def can_borrow(self, member_id: int) -> bool:
        '''Check if member can borrow books'''
        member = self.get_object(member_id)
        if member.is_blocked:
            return False
        
        # Check outstanding fines
        from apps.fines.models import Fine
        unpaid_fines = Fine.objects.filter(member=member, status='unpaid')
        if unpaid_fines.exists():
            return False
        
        return True

    def delete(self, instance):
        from apps.transactions.models import Transaction, Reservation
        from apps.fines.models import Fine

        if Transaction.objects.filter(member=instance, status__in=['issued', 'overdue']).exists():
            raise BusinessLogicException(
                'Cannot delete member with active borrowings. Return all books first.'
            )
        if Reservation.objects.filter(member=instance, status='pending').exists():
            raise BusinessLogicException(
                'Cannot delete member with pending reservations.'
            )
        if Fine.objects.filter(member=instance, status='unpaid').exists():
            raise BusinessLogicException(
                'Cannot delete member with unpaid fines.'
            )
        instance.delete()
