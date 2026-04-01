from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.core.views.base import BaseAPIView
from .models import Transaction, Reservation
from .serializers import (
    TransactionSerializer, TransactionCreateSerializer,
    ReservationSerializer
)
from .services import TransactionService, ReservationService


class TransactionListCreateView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        service = TransactionService()
        transactions = service.list()
        serializer = TransactionSerializer(transactions, many=True)
        return self.success_response(serializer.data)
    
    def post(self, request):
        serializer = TransactionCreateSerializer(data=request.data)
        if serializer.is_valid():
            service = TransactionService()
            transaction = service.issue_book(
                member_id=serializer.validated_data['member'].id,
                book_id=serializer.validated_data['book'].id,
                issued_by=request.user
            )
            return self.success_response(
                TransactionSerializer(transaction).data,
                message="Book issued successfully",
                status_code=status.HTTP_201_CREATED
            )
        return self.error_response("Validation failed", errors=serializer.errors)


class TransactionDetailView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        service = TransactionService()
        transaction = service.get_object(pk)
        serializer = TransactionSerializer(transaction)
        return self.success_response(serializer.data)


class TransactionReturnView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        service = TransactionService()
        transaction = service.return_book(pk)
        return self.success_response(
            TransactionSerializer(transaction).data,
            message="Book returned successfully"
        )


class ReservationListCreateView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        service = ReservationService()
        reservations = service.list()
        serializer = ReservationSerializer(reservations, many=True)
        return self.success_response(serializer.data)
    
    def post(self, request):
        member_id = request.data.get('member')
        book_id = request.data.get('book')
        
        service = ReservationService()
        reservation = service.create_reservation(member_id, book_id)
        return self.success_response(
            ReservationSerializer(reservation).data,
            message="Reservation created successfully",
            status_code=status.HTTP_201_CREATED
        )


class ReservationDetailView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        service = ReservationService()
        reservation = service.get_object(pk)
        serializer = ReservationSerializer(reservation)
        return self.success_response(serializer.data)


class ReservationApproveView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        service = ReservationService()
        reservation = service.approve_reservation(pk)
        return self.success_response(
            ReservationSerializer(reservation).data,
            message="Reservation approved"
        )


class ReservationCancelView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        service = ReservationService()
        reservation = service.cancel_reservation(pk)
        return self.success_response(
            ReservationSerializer(reservation).data,
            message="Reservation cancelled"
        )
