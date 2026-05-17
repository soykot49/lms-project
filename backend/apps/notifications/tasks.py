from celery import shared_task
from datetime import date, timedelta
from apps.transactions.models import Transaction
from apps.fines.services import FineService
from .services import NotificationService


@shared_task
def send_due_date_reminders():
    '''Remind members about books due within the next 2 days.'''
    tomorrow = date.today() + timedelta(days=1)
    day_after = date.today() + timedelta(days=2)

    due_soon = Transaction.objects.filter(
        status='issued',
        due_date__in=[tomorrow, day_after],
    ).select_related('member', 'book')

    notif_service = NotificationService()
    count = 0

    for transaction in due_soon:
        days_left = (transaction.due_date - date.today()).days
        notif_service.create_notification(
            member_id=transaction.member.id,
            title=f'Book Due in {days_left} Day(s)',
            message=(
                f'"{transaction.book.title}" is due on {transaction.due_date}. '
                'Please return on time to avoid fines.'
            ),
            notification_type='overdue',
            audience='member',
        )
        count += 1

    return f'Sent {count} due date reminder(s)'


@shared_task
def process_overdue_loans():
    '''
    Daily job: mark overdue loans, accrue fines, notify member and staff.
    Runs via Celery Beat (see setup_periodic_tasks).
    '''
    today = date.today()
    overdue_loans = Transaction.objects.filter(
        status__in=['issued', 'overdue'],
        due_date__lt=today,
        return_date__isnull=True,
    ).select_related('member', 'book')

    notif_service = NotificationService()
    fine_service = FineService()
    member_alerts = 0
    staff_alerts = 0

    for transaction in overdue_loans:
        if transaction.status != 'overdue':
            transaction.status = 'overdue'
            transaction.save(update_fields=['status', 'updated_at'])

        days_overdue = (today - transaction.due_date).days
        fine = fine_service.sync_running_fine(transaction)
        fine_amount = fine.amount if fine else 0

        if transaction.last_reminder_at == today:
            continue

        book_title = transaction.book.title
        member = transaction.member
        member_label = f'{member.full_name} ({member.member_id})'

        notif_service.create_notification(
            member_id=member.id,
            title='Book Overdue',
            message=(
                f'"{book_title}" is {days_overdue} day(s) overdue. '
                f'Current fine: ৳{fine_amount}. Please return the book as soon as possible.'
            ),
            notification_type='overdue',
            audience='member',
        )
        member_alerts += 1

        notif_service.create_staff_alert(
            member_id=member.id,
            title='Overdue Book — Action Required',
            message=(
                f'{member_label} has not returned "{book_title}" '
                f'({days_overdue} day(s) overdue). Accrued fine: ৳{fine_amount}.'
            ),
            notification_type='overdue',
        )
        staff_alerts += 1

        transaction.last_reminder_at = today
        transaction.save(update_fields=['last_reminder_at'])

    return (
        f'Processed {overdue_loans.count()} overdue loan(s); '
        f'member alerts={member_alerts}; staff alerts={staff_alerts}'
    )


@shared_task
def send_overdue_notifications():
    '''Backward-compatible alias for process_overdue_loans.'''
    return process_overdue_loans()


@shared_task
def check_expired_reservations():
    '''Check and update expired reservations.'''
    from apps.transactions.models import Reservation

    count = Reservation.objects.filter(
        status='pending',
        expires_on__lt=date.today(),
    ).update(status='expired')
    return f'Marked {count} reservation(s) as expired'
