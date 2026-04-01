from django.urls import path
from .views import (
    MemberListCreateView, MemberDetailView,
    MemberBlockView, MemberUnblockView, MemberHistoryView
)

urlpatterns = [
    path('', MemberListCreateView.as_view(), name='member-list-create'),
    path('<int:pk>/', MemberDetailView.as_view(), name='member-detail'),
    path('<int:pk>/block/', MemberBlockView.as_view(), name='member-block'),
    path('<int:pk>/unblock/', MemberUnblockView.as_view(), name='member-unblock'),
    path('<int:pk>/history/', MemberHistoryView.as_view(), name='member-history'),
]
