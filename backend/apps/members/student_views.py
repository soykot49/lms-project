from django.db.models import Sum
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsStudentUser
from apps.core.views.base import BaseAPIView
from apps.transactions.models import Transaction, Reservation
from apps.transactions.serializers import TransactionSerializer, ReservationSerializer
from apps.transactions.services import ReservationService
from apps.fines.models import Fine
from apps.fines.serializers import FineSerializer
from apps.books.models import Book
from apps.books.serializers import BookListSerializer
from apps.members.serializers import MemberSerializer


class StudentDashboardView(BaseAPIView):
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get(self, request):
        member = request.user.member
        active_borrowings = Transaction.objects.filter(
            member=member,
            status__in=['issued', 'overdue'],
        ).select_related('book')
        reservations = Reservation.objects.filter(member=member).select_related('book')
        fines = Fine.objects.filter(member=member).select_related('transaction', 'transaction__book')

        unpaid_total = fines.filter(status='unpaid').aggregate(
            total=Sum('amount')
        )['total'] or 0

        data = {
            'member': MemberSerializer(member).data,
            'stats': {
                'active_borrowings': active_borrowings.count(),
                'pending_reservations': reservations.filter(status='pending').count(),
                'unpaid_fines': float(unpaid_total),
                'total_borrowed_ever': Transaction.objects.filter(member=member).count(),
            },
            'borrowings': TransactionSerializer(active_borrowings, many=True).data,
            'reservations': ReservationSerializer(reservations.order_by('-created_at')[:20], many=True).data,
            'fines': FineSerializer(fines.order_by('-created_at')[:20], many=True).data,
        }
        return self.success_response(data)


class StudentBorrowingsView(BaseAPIView):
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get(self, request):
        member = request.user.member
        qs = Transaction.objects.filter(member=member).select_related('book').order_by('-issue_date')
        return self.success_response(TransactionSerializer(qs, many=True).data)


class StudentFinesView(BaseAPIView):
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get(self, request):
        member = request.user.member
        qs = Fine.objects.filter(member=member).select_related(
            'transaction', 'transaction__book'
        ).order_by('-created_at')
        return self.success_response(FineSerializer(qs, many=True).data)


class StudentReservationsView(BaseAPIView):
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get(self, request):
        member = request.user.member
        qs = Reservation.objects.filter(member=member).select_related('book').order_by('-created_at')
        return self.success_response(ReservationSerializer(qs, many=True).data)

    def post(self, request):
        book_id = request.data.get('book')
        if not book_id:
            return self.error_response('Book is required')

        service = ReservationService()
        reservation = service.create_reservation(request.user.member.id, int(book_id))
        return self.success_response(
            ReservationSerializer(reservation).data,
            message='Reservation request submitted. A librarian will review it.',
            status_code=status.HTTP_201_CREATED,
        )


class StudentNotificationsView(BaseAPIView):
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get(self, request):
        from apps.notifications.models import Notification
        from apps.notifications.serializers import NotificationSerializer

        member = request.user.member
        qs = Notification.objects.filter(
            member=member,
            audience='member',
        ).order_by('-created_at')[:50]
        return self.success_response(NotificationSerializer(qs, many=True).data)


class StudentBooksCatalogView(BaseAPIView):
    """Books available to request."""
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get(self, request):
        books = Book.objects.filter(available_quantity__gt=0).select_related('author', 'category')
        search = request.query_params.get('search')
        if search:
            from apps.books.services import BookService
            books = BookService().search_books(search)
        return self.success_response(BookListSerializer(books, many=True).data)
