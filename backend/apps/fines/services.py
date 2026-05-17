from datetime import date
from decimal import Decimal
from django.conf import settings
from apps.core.services.base import BaseService
from apps.core.exceptions import BusinessLogicException
from .models import Fine, FineSettings


class FineService(BaseService):
    model = Fine

    def get_queryset(self):
        return self.model.objects.select_related(
            'member', 'transaction', 'transaction__book'
        )
    
    def calculate_fine(self, transaction) -> Decimal:
        '''Calculate fine for an overdue transaction'''
        settings_obj = FineSettings.get_settings()
        fine_per_day = settings_obj.fine_per_day
        
        return_date = transaction.return_date or date.today()
        days_overdue = (return_date - transaction.due_date).days
        
        if days_overdue <= 0:
            return Decimal('0.00')
        
        return Decimal(days_overdue) * fine_per_day
    
    def create_fine_for_transaction(self, transaction):
        '''Create fine for an overdue transaction'''
        if hasattr(transaction, 'fine'):
            raise BusinessLogicException("Fine already exists for this transaction")
        
        amount = self.calculate_fine(transaction)
        if amount <= 0:
            return None
        
        fine = self.model.objects.create(
            transaction=transaction,
            member=transaction.member,
            amount=amount,
            status='unpaid'
        )
        
        # Create notification
        from apps.notifications.services import NotificationService
        notif_service = NotificationService()
        notif_service.create_notification(
            member_id=transaction.member.id,
            title="Fine Applied",
            message=f"A fine of ৳{amount} has been applied for late return",
            notification_type="fine"
        )
        
        return fine
    
    def collect_fine(self, fine_id: int):
        '''Mark fine as paid'''
        from django.utils import timezone
        fine = self.get_object(fine_id)
        
        if fine.status == 'paid':
            raise BusinessLogicException("Fine is already paid")
        if fine.status == 'waived':
            raise BusinessLogicException("Fine is already waived")
        
        fine.status = 'paid'
        fine.paid_at = timezone.now()
        fine.save()
        return fine
    
    def waive_fine(self, fine_id: int):
        '''Waive a fine'''
        from django.utils import timezone
        fine = self.get_object(fine_id)
        
        if fine.status == 'paid':
            raise BusinessLogicException("Cannot waive a paid fine")
        if fine.status == 'waived':
            raise BusinessLogicException("Fine is already waived")
        
        fine.status = 'waived'
        fine.waived_at = timezone.now()
        fine.save()
        return fine
    
    def get_unpaid_fines(self):
        '''Get all unpaid fines'''
        return self.model.objects.filter(status='unpaid')


class FineSettingsService(BaseService):
    model = FineSettings
    
    def get_settings(self):
        return FineSettings.get_settings()
    
    def update_settings(self, fine_per_day: Decimal):
        settings = self.get_settings()
        settings.fine_per_day = fine_per_day
        settings.save()
        return settings
