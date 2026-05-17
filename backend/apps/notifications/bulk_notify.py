from collections import defaultdict
from datetime import date
from decimal import Decimal

from django.db.models import Sum

from apps.transactions.models import Transaction
from apps.fines.models import Fine
from apps.fines.services import FineService
from apps.members.models import Member
from .services import NotificationService


class BulkNotificationService:
    VALID_TARGETS = ('overdue', 'fines', 'all')

    def __init__(self):
        self.notif_service = NotificationService()
        self.fine_service = FineService()

    def _overdue_transactions(self):
        return Transaction.objects.filter(
            status__in=['issued', 'overdue'],
            due_date__lt=date.today(),
            return_date__isnull=True,
        ).select_related('member', 'book', 'fine')

    def _member_ids_with_unpaid_fines(self):
        return set(
            Fine.objects.filter(status='unpaid')
            .values_list('member_id', flat=True)
            .distinct()
        )

    def _resolve_member_ids(self, target, overdue_member_ids, fine_member_ids):
        if target == 'overdue':
            return overdue_member_ids
        if target == 'fines':
            return fine_member_ids
        return overdue_member_ids | fine_member_ids

    def get_preview(self, target='all'):
        if target not in self.VALID_TARGETS:
            target = 'all'

        overdue_qs = self._overdue_transactions()
        overdue_member_ids = set(overdue_qs.values_list('member_id', flat=True).distinct())
        fine_member_ids = self._member_ids_with_unpaid_fines()
        combined = self._resolve_member_ids(target, overdue_member_ids, fine_member_ids)

        total_unpaid = Fine.objects.filter(status='unpaid').aggregate(
            total=Sum('amount'),
        )['total'] or Decimal('0')

        return {
            'target': target,
            'overdue_members': len(overdue_member_ids),
            'overdue_books': overdue_qs.count(),
            'members_with_fines': len(fine_member_ids),
            'total_unpaid_fines': float(total_unpaid),
            'members_to_notify': len(combined),
        }

    def send_bulk_reminders(self, target='all'):
        if target not in self.VALID_TARGETS:
            target = 'all'

        today = date.today()
        overdue_qs = self._overdue_transactions()
        overdue_by_member = defaultdict(list)
        fine_member_ids = self._member_ids_with_unpaid_fines()
        overdue_member_ids = set()

        for transaction in overdue_qs:
            if transaction.status != 'overdue':
                transaction.status = 'overdue'
                transaction.save(update_fields=['status', 'updated_at'])
            self.fine_service.sync_running_fine(transaction)
            overdue_by_member[transaction.member_id].append(transaction)
            overdue_member_ids.add(transaction.member_id)

        member_ids = self._resolve_member_ids(target, overdue_member_ids, fine_member_ids)
        members = {
            m.id: m
            for m in Member.objects.filter(id__in=member_ids)
        }

        member_notifications = 0
        for member_id in member_ids:
            member = members.get(member_id)
            if not member:
                continue

            parts = []
            notification_type = 'general'

            overdue_list = overdue_by_member.get(member_id, [])
            if overdue_list and target in ('overdue', 'all'):
                notification_type = 'overdue'
                lines = []
                total_running_fine = Decimal('0')
                for tx in overdue_list:
                    days = (today - tx.due_date).days
                    fine = Fine.objects.filter(transaction_id=tx.id, status='unpaid').first()
                    amount = fine.amount if fine else Decimal('0')
                    total_running_fine += amount
                    lines.append(
                        f'• "{tx.book.title}" — {days} day(s) overdue'
                        + (f' (fine ৳{amount})' if amount else '')
                    )
                parts.append(
                    'You have not returned the following book(s):\n'
                    + '\n'.join(lines)
                    + (f'\nTotal accrued fine: ৳{total_running_fine}.' if total_running_fine else '')
                    + '\nPlease return them to the library as soon as possible.'
                )
                for tx in overdue_list:
                    tx.last_reminder_at = today
                    tx.save(update_fields=['last_reminder_at'])

            if member_id in fine_member_ids and target in ('fines', 'all'):
                unpaid_total = Fine.objects.filter(
                    member_id=member_id,
                    status='unpaid',
                ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
                if unpaid_total > 0:
                    if notification_type != 'overdue':
                        notification_type = 'fine'
                    parts.append(
                        f'You have unpaid library fines totalling ৳{unpaid_total}. '
                        'Please visit the library desk to settle your account.'
                    )

            if not parts:
                continue

            self.notif_service.create_notification(
                member_id=member_id,
                title='Library Reminder',
                message='\n\n'.join(parts),
                notification_type=notification_type,
                audience='member',
            )
            member_notifications += 1

        staff_message = (
            f'Bulk reminders sent to {member_notifications} member(s) '
            f'(target: {target}).'
        )
        if member_ids:
            self.notif_service.create_staff_alert(
                member_id=next(iter(member_ids)),
                title='Bulk Reminders Sent',
                message=staff_message,
                notification_type='general',
            )

        return {
            'target': target,
            'members_notified': member_notifications,
            'overdue_books': overdue_qs.count(),
            'members_with_fines': len(fine_member_ids),
        }
