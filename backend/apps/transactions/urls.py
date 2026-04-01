from django.urls import path
from .views import (
    TransactionListCreateView, TransactionDetailView, TransactionReturnView,
    ReservationListCreateView, ReservationDetailView,
    ReservationApproveView, ReservationCancelView
)

urlpatterns = [
    path('', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('<int:pk>/return/', TransactionReturnView.as_view(), name='transaction-return'),
    path('reservations/', ReservationListCreateView.as_view(), name='reservation-list-create'),
    path('reservations/<int:pk>/', ReservationDetailView.as_view(), name='reservation-detail'),
    path('reservations/<int:pk>/approve/', ReservationApproveView.as_view(), name='reservation-approve'),
    path('reservations/<int:pk>/cancel/', ReservationCancelView.as_view(), name='reservation-cancel'),
]
