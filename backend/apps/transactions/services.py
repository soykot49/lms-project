from datetime import date, timedelta
from django.conf import settings
from django.db import transaction as db_transaction
from apps.core.services.base import BaseService
from apps.core.exceptions import BusinessLogicException, ValidationException
from .models import Transaction, Reservation
from apps.books.services import BookService
from apps.members.services import MemberService


class TransactionService(BaseService):
    model = Transaction

    def get_queryset(self):
        self.mark_overdue_transactions()
        return self.model.objects.select_related('member', 'book', 'issued_by')

    def mark_overdue_transactions(self):
        self.model.objects.filter(
            status='issued',
            due_date__lt=date.today(),
        ).update(status='overdue')

    def list(self, filters=None):
        return super().list(filters)
    
    @db_transaction.atomic
    def issue_book(self, member_id: int, book_id: int, issued_by, days: int = None, due_date=None, notes: str = ''):
        '''Issue a book to a member'''
        member_service = MemberService()
        book_service = BookService()
        
        # Check if member can borrow
        if not member_service.can_borrow(member_id):
            raise BusinessLogicException("Member cannot borrow books (blocked or has fines)")
        
        book_service.sync_availability_from_loans(book_id)
        if not book_service.check_availability(book_id):
            raise BusinessLogicException("Book is not available")
        
        # Calculate due date
        if due_date is None:
            if days is None:
                days = settings.LIBRARY_SETTINGS['DEFAULT_BORROWING_DAYS']
            due_date = date.today() + timedelta(days=days)
        
        # Create transaction
        transaction = self.model.objects.create(
            member_id=member_id,
            book_id=book_id,
            issued_by=issued_by,
            due_date=due_date,
            status='issued',
            notes=notes or '',
        )
        
        book_service.sync_availability_from_loans(book_id)
        
        # Create notification
        from apps.notifications.services import NotificationService
        notif_service = NotificationService()
        notif_service.create_notification(
            member_id=member_id,
            title="Book Issued",
            message=f"You have borrowed '{transaction.book.title}'. Due date: {due_date}",
            notification_type="issue"
        )
        
        return transaction
    
    @db_transaction.atomic
    def return_book(self, transaction_id: int):
        '''Return a borrowed book'''
        transaction = self.get_object(transaction_id)
        
        if transaction.status == 'returned':
            raise BusinessLogicException("Book already returned")
        if transaction.status not in ('issued', 'overdue'):
            raise BusinessLogicException("Only issued or overdue books can be returned")
        
        transaction.return_date = date.today()
        transaction.status = 'returned'
        transaction.save()
        
        book_service = BookService()
        book_service.sync_availability_from_loans(transaction.book.id)
        
        # Finalize fine if overdue (may already exist from daily Celery sync)
        if transaction.return_date > transaction.due_date:
            from apps.fines.services import FineService
            FineService().create_fine_for_transaction(transaction)
        
        return transaction
    
    def get_overdue_transactions(self):
        '''Get all overdue transactions'''
        return self.model.objects.filter(
            status='issued',
            due_date__lt=date.today()
        )


class ReservationService(BaseService):
    model = Reservation

    def get_queryset(self):
        self.expire_reservations()
        return self.model.objects.select_related('member', 'book')

    def expire_reservations(self):
        self.model.objects.filter(
            status='pending',
            expires_on__lt=date.today(),
        ).update(status='expired')
    
    def create_reservation(self, member_id: int, book_id: int):
        '''Create a reservation'''
        member_service = MemberService()
        if not member_service.can_borrow(member_id):
            raise BusinessLogicException("Member cannot make reservations")
        
        expires_on = date.today() + timedelta(
            days=settings.LIBRARY_SETTINGS['RESERVATION_EXPIRY_DAYS']
        )
        
        reservation = self.model.objects.create(
            member_id=member_id,
            book_id=book_id,
            expires_on=expires_on,
            status='pending'
        )
        return reservation
    
    def approve_reservation(self, reservation_id: int, issued_by=None):
        '''Approve a reservation and issue the book when available'''
        reservation = self.get_object(reservation_id)
        if reservation.status != 'pending':
            raise BusinessLogicException("Only pending reservations can be approved")

        book_service = BookService()
        issued = False
        if issued_by and book_service.check_availability(reservation.book_id):
            TransactionService().issue_book(
                member_id=reservation.member_id,
                book_id=reservation.book_id,
                issued_by=issued_by,
            )
            reservation.status = 'fulfilled'
            issued = True
        else:
            reservation.status = 'ready'
        reservation.save()

        from apps.notifications.services import NotificationService
        notif_service = NotificationService()
        if issued:
            notif_service.create_notification(
                member_id=reservation.member.id,
                title="Reservation Fulfilled",
                message=f"'{reservation.book.title}' has been issued to you",
                notification_type="reservation",
            )
        else:
            notif_service.create_notification(
                member_id=reservation.member.id,
                title="Reservation Ready",
                message=f"'{reservation.book.title}' is ready for pickup",
                notification_type="reservation",
            )

        return reservation
    
    def cancel_reservation(self, reservation_id: int):
        '''Cancel a reservation'''
        reservation = self.get_object(reservation_id)
        if reservation.status in ['fulfilled', 'cancelled']:
            raise BusinessLogicException("Cannot cancel this reservation")
        
        reservation.status = 'cancelled'
        reservation.save()
        return reservation
