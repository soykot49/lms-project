from apps.core.services.base import BaseService
from apps.core.exceptions import BusinessLogicException
from .models import Member


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
