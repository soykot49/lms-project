from django.urls import path
from apps.members.student_views import (
    StudentDashboardView,
    StudentBorrowingsView,
    StudentFinesView,
    StudentReservationsView,
    StudentBooksCatalogView,
    StudentNotificationsView,
)

urlpatterns = [
    path('dashboard/', StudentDashboardView.as_view(), name='student-dashboard'),
    path('borrowings/', StudentBorrowingsView.as_view(), name='student-borrowings'),
    path('fines/', StudentFinesView.as_view(), name='student-fines'),
    path('reservations/', StudentReservationsView.as_view(), name='student-reservations'),
    path('books/', StudentBooksCatalogView.as_view(), name='student-books'),
    path('notifications/', StudentNotificationsView.as_view(), name='student-notifications'),
]
