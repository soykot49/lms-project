from celery import shared_task
from datetime import date, timedelta
from django.db.models import Q
from apps.transactions.models import Transaction
from apps.members.models import Member
from .services import NotificationService


@shared_task
def send_due_date_reminders():
    '''Send notifications for books due soon (within 2 days)'''
    tomorrow = date.today() + timedelta(days=1)
    day_after = date.today() + timedelta(days=2)
    
    due_soon_transactions = Transaction.objects.filter(
        status='issued',
        due_date__in=[tomorrow, day_after]
    )
    
    notif_service = NotificationService()
    count = 0
    
    for transaction in due_soon_transactions:
        days_left = (transaction.due_date - date.today()).days
        
        notif_service.create_notification(
            member_id=transaction.member.id,
            title=f"Book Due in {days_left} Day(s)",
            message=f"'{transaction.book.title}' is due on {transaction.due_date}. Please return on time.",
            notification_type="overdue"
        )
        count += 1
    
    return f"Sent {count} due date reminder(s)"


@shared_task
def send_overdue_notifications():
    '''Send notifications for overdue books'''
    today = date.today()
    
    overdue_transactions = Transaction.objects.filter(
        status='issued',
        due_date__lt=today
    )
    
    notif_service = NotificationService()
    count = 0
    
    for transaction in overdue_transactions:
        days_overdue = (today - transaction.due_date).days
        
        # Update transaction status
        transaction.status = 'overdue'
        transaction.save()
        
        notif_service.create_notification(
            member_id=transaction.member.id,
            title="Book Overdue",
            message=f"'{transaction.book.title}' is {days_overdue} day(s) overdue. Fines may apply.",
            notification_type="overdue"
        )
        count += 1
    
    return f"Sent {count} overdue notification(s)"


@shared_task
def check_expired_reservations():
    '''Check and update expired reservations'''
    from apps.transactions.models import Reservation
    today = date.today()
    
    expired_reservations = Reservation.objects.filter(
        status='pending',
        expires_on__lt=today
    )
    
    count = expired_reservations.update(status='expired')
    return f"Marked {count} reservation(s) as expired"
